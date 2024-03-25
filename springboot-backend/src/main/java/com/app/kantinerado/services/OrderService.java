package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
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
import java.util.Date;
import java.util.List;

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

    public List<Order> findOrderBy(int kw, ApplicationUser user)
    {
        return orderRepository.findByWeekNumberAndUser(kw, user.getUserId());
    }

    public List<Order> getAllOders(ApplicationUser user)
    {
        return orderRepository.findByUser(user);
    }

    //Validierung der Bestellung
    public boolean placeOrder(OrderDTO order, ApplicationUser applicationUser) {

        Dish orderedDish = dishRepository.findById(order.getDish_id())
                .orElse(null);

        Date dayOfDish = order.getDate();
        Date currentDate = new Date();

        if(orderedDish == null || dayOfDish == null) return false;

        Calendar calendarDateOfDish = Calendar.getInstance();
        calendarDateOfDish.setTime(dayOfDish);


        // Das Bestelldatum muss mindestens in der nächsten Kalenderwoche liegen
        Calendar nextWeek = Calendar.getInstance();
        nextWeek.setTime(currentDate);
        nextWeek.add(Calendar.WEEK_OF_YEAR, 1); // eine Woche hinzufügen

        Calendar nextThursday = Calendar.getInstance();
        nextThursday.setTime(dayOfDish);
        nextThursday.set(Calendar.DAY_OF_WEEK, nextThursday.THURSDAY); // auf Donnerstag setzen
        nextThursday.set(Calendar.HOUR_OF_DAY, 18); // auf 18 Uhr setzen
        nextThursday.set(Calendar.MINUTE, 0); // auf 0 Minuten setzen
        nextThursday.set(Calendar.SECOND, 0); // auf 0 Sekunden setzen
        nextThursday.add(Calendar.WEEK_OF_YEAR, -1); // Donnerstag der letzen Woche
        Date deadlineThursday = nextThursday.getTime();

        // Das aktuelle Datum darf nicht nach Donnerstag 18:00 Uhr sein
        if (currentDate.after(deadlineThursday)) {
            setMessage("Bestellung ist nur bis Donnerstag, 18:00 Uhr für die kommende Woche möglich");
            return false;
        }

        // Das Bestelldatum muss mindestens in der nächsten Kalenderwoche liegen
        if (!calendarDateOfDish.after(nextWeek)) {
            setMessage("Bestelldatum muss mindestens in der nächsten Kalenderwoche liegen");
            return false;
        }

        // Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde
        if (!orderedDish.getDishCategory().isCanVeggie() && order.isVeggie()) {
            setMessage("Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde");
            return false;
        }

        // Samstags darf kein Menü 1 und keine Suppe bestellt werden
        if ((orderedDish.getDishCategory().getName().equals("Menü1") ||
                orderedDish.getDishCategory().getName().equals("Suppe")) &&
                calendarDateOfDish.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
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

    public boolean deleteOrder(Integer orderId, ApplicationUser user) {
        Calendar calendar = Calendar.getInstance();
        Date today = calendar.getTime();
        calendar.add(Calendar.DAY_OF_YEAR, 1);

        Date tomorrow = calendar.getTime();

        Order order = orderRepository.getReferenceById(orderId);

        if(order.getDate().after(tomorrow) &&
        user.getUserId() == order.getUser().getUserId()) {
            orderRepository.deleteById(orderId);
            return true;
        } else {
            return  false;
        }
    }

    public List<Order> getEveryOrderByKw(int kw) {
        return orderRepository.findOrderByWeekNumber(kw);
    }
}
