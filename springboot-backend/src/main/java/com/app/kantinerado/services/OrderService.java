package com.app.kantinerado.services;

import com.app.kantinerado.models.mealplan.Order;
import org.springframework.security.core.Transient;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;

@Service
@Transient
public class OrderService {
    //Validierung der Bestellung
    public boolean checkOrder(Order order) {

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
        Date nextThursday18 = currentCalendarDate.getTime();


        //Bestellung ist bis Donnerstag, 1800 Uhr für die kommende Woche möglich
        if (order.getDate().after(nextThursday18)) {
            return false;
        }
        //Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde
        if (!order.getDish().getDishCategory().isCanVeggie() && order.isVeggie()) {
            return false;
        }
        //Samstags darf kein Menü 1 und keine Suppe bestellt werden
        if (currentDayOfWeek == 6 && (order.getDish().getDishCategory().getName().equals("Menü1") ||
                order.getDish().getDishCategory().getName().equals("Suppe"))) {
            return false;
        }

        return true;
    }
}
