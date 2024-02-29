package com.app.kantinerado.services;

import com.app.kantinerado.models.mealplan.Order;
import org.springframework.security.core.Transient;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;

@Service
@Transient
public class OrderService {


    public String message = "Unbekannter Fehler";

    //Validierung der Bestellung
    public boolean checkOrder(Order order) {

        Date nextThursday18 = getNextThursday18();


        //Bestellung ist bis Donnerstag, 1800 Uhr für die kommende Woche möglich
        if (order.getDate().after(nextThursday18)) {
            setMessage("Bestellung ist nur bis Donnerstag, 1800 Uhr für die kommende Woche möglich");
            return false;
        }
        //Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde
        if (!order.getDish().getDishCategory().isCanVeggie() && order.isVeggie()) {
            setMessage("Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde");
            return false;
        }
        //Samstags darf kein Menü 1 und keine Suppe bestellt werden
        if (order.getDate().getDate() == 7 && (order.getDish().getDishCategory().getName().equals("Menü1") ||
                order.getDish().getDishCategory().getName().equals("Suppe"))) {
            setMessage("Samstags darf kein Menü 1 und keine Suppe bestellt werden");
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
