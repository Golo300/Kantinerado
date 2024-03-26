package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.Mealplan;
import com.app.kantinerado.repository.DayRepository;
import com.app.kantinerado.repository.MealplanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Transient;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transient
public class MealplanService {

    @Autowired
    private MealplanRepository mealplanRepository;
    @Autowired
    private DayRepository dayRepository;

    @Autowired
    private DishService dishService;

    public Mealplan findMealPlanbyKw(Integer kw) {
        Optional<Mealplan> mealplanOptional = mealplanRepository.findByCalendarWeek(kw);

        return mealplanOptional.orElse(null);

    }

    public void createMealplanByKw(int year, int kw, Set<Dish> dishes) {
        Mealplan mealplan = new Mealplan();
        Set<Day> days = new HashSet<>();

        Calendar calendar = Calendar.getInstance();
        calendar.clear();
        calendar.set(Calendar.YEAR, year);
        calendar.set(Calendar.WEEK_OF_YEAR, kw);
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY); // Start der Woche auf Montag setzen

        // Iteration über die Tage von Montag bis Samstag
        for (int i = Calendar.MONDAY; i <= Calendar.SATURDAY; i++) {
            Day day = new Day();
            day.setDate(calendar.getTime());
            day.setNoFood(false);
            days.add(day);
            calendar.add(Calendar.DATE, 1); // Nächsten Tag hinzufügen

            //dishes hinzufügen
            day.setDishes(dishes);
            dayRepository.save(day);
        }
        mealplan.setDays(days);
        mealplan.setPlanned(true);
        mealplan.setCalendarWeek(kw);
        mealplanRepository.save(mealplan);
    }


    public Dish addNewDish(Dish newDish, ApplicationUser user) {

        return dishService.addDish(newDish);
    }

    public boolean addDishToDay(int dishId, int kw, int dayNumber, ApplicationUser user) {

        if (mealplanRepository.findByCalendarWeek(kw).isEmpty()) {
            Mealplan mealplan = new Mealplan();
            mealplan.setPlanned(true);
            mealplan.setCalendarWeek(kw);
            mealplanRepository.save(mealplan);

        }

            Mealplan mp = mealplanRepository.findByCalendarWeek(kw).orElse(null);
            Dish dish = dishService.getDishById(dishId);

            Calendar calendar = Calendar.getInstance();
            calendar.clear();
            calendar.set(Calendar.YEAR, 2024);
            calendar.set(Calendar.WEEK_OF_YEAR, kw);
            calendar.set(Calendar.DAY_OF_WEEK, dayNumber + 1); // Start der Woche auf Montag setzen

            Set<Day> days = mp.getDays();

            for (Day day : days) {
                if (day.getDate().getDate() == calendar.getTime().getDate()) {
                    day.addDish(dish);
                    dayRepository.save(day);
                    return true;
                }
            }

            Day day = new Day();
            day.setDate(calendar.getTime());
            day.setNoFood(false);

            day.addDish(dish);
            days.add(day);
            mp.setDays(days);
            dayRepository.save(day);
            mealplanRepository.save(mp);

        return true;
    }
}

