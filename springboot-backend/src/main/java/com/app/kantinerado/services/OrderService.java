package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.Order;
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

    public List<Order> findOrderBy(int kw, ApplicationUser user)
    {
        return orderRepository.findByWeekNumber(kw, user.getUserId());
    }

    public List<Order> getAllOders(ApplicationUser user)
    {
        return orderRepository.findByUser(user);
    }

    //Validierung der Bestellung
    public boolean placeOrder(OrderDTO order, ApplicationUser aplicationUser) {


        Dish orderedDish = dishRepository.findById(order.getDish_id())
                .orElse(null);

        if(orderedDish == null) return false;

        Date nextThursday18 = getNextThursday18();

        //Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde
        if (!orderedDish.getDishCategory().isCanVeggie() && order.isVeggie()) {
            setMessage("Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde");
            return false;
        }

        Order newOrder = new Order(order, orderedDish, aplicationUser);

        try {
            orderRepository.save(newOrder);
        } catch (DataAccessException e) {
            // Fehlerbehandlung für Datenbankzugriffsfehler
            return false;
        }

        return true;
    }

    private static Date getNextThursday18() {
        Date currentDate = new Date();
        Calendar currentCalendarDate = Calendar.getInstance();
        currentCalendarDate.setTime(currentDate);
        int currentDayOfWeek = currentCalendarDate.get(Calendar.DAY_OF_WEEK);
        int daysUntilNextThursday = Calendar.THURSDAY - currentDayOfWeek;
        if (daysUntilNextThursday <= 0) {
            daysUntilNextThursday += 7; // Wenn der heutige Tag bereits ein Donnerstag ist, fügen Sie 7 Tage hinzu
        }
        currentCalendarDate.add(Calendar.DAY_OF_YEAR, daysUntilNextThursday);
        currentCalendarDate.set(Calendar.HOUR_OF_DAY, 18);
        return currentCalendarDate.getTime();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
