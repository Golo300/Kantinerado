package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.repository.DayRepository;
import com.app.kantinerado.repository.DishRepository;
import com.app.kantinerado.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Transient;
import org.springframework.stereotype.Service;

import java.util.Calendar;

@Service
@Transient
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DishRepository dishRepository;

    public String message = "Unbekannter Fehler";
    @Autowired
    private DayRepository dayRepository;

    //Validierung der Bestellung
    public boolean placeOrder(OrderDTO order, ApplicationUser applicationUser) {

        Dish orderedDish = dishRepository.findById(order.getDish_id())
                .orElse(null);
        Day dayOfDish = dayRepository.findDayByDishesContains(orderedDish)
                .orElse(null);

        if(orderedDish == null || dayOfDish == null) return false;

        Calendar calendarDateOfDish = Calendar.getInstance();
        calendarDateOfDish.setTime(dayOfDish.getDate());
        int dayOfWeek = calendarDateOfDish.get(Calendar.DAY_OF_WEEK);

        Calendar nextThursday = calendarDateOfDish;
        nextThursday.add(Calendar.WEEK_OF_YEAR, 1); // eine Woche hinzufügen
        nextThursday.set(Calendar.DAY_OF_WEEK, Calendar.THURSDAY); // auf Donnerstag setzen

        //Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde
        if (!orderedDish.getDishCategory().isCanVeggie() && order.isVeggie()) {
            setMessage("Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde");
            return false;
        }

        //Bestellung ist bis Donnerstag, 18:00 Uhr für die kommende Woche möglich
        if ( dayOfDish.getDate().after(nextThursday.getTime())) {
            setMessage("Bestellung ist nur bis Donnerstag, 18:00 Uhr für die kommende Woche möglich");
            return false;
        }

        //Samstags darf kein Menü 1 und keine Suppe bestellt werden
        if ((orderedDish.getDishCategory().getName().equals("Menü1") ||
                orderedDish.getDishCategory().getName().equals("Suppe")) &&
        dayOfWeek == Calendar.SATURDAY) {
            setMessage("Samstags darf kein Menü 1 und keine Suppe bestellt werden");
            return false;
        }

        Order newOrder = new Order(order, orderedDish, applicationUser);

        try {
            orderRepository.save(newOrder);
        } catch (DataAccessException e) {
            // Fehlerbehandlung für Datenbankzugriffsfehler
            return false;
        }

        return true;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
