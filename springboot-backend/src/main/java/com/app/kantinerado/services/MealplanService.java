package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.repository.DayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Transient;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transient
public class MealplanService {

    @Autowired
    private DayRepository dayRepository;

    @Autowired
    private DishService dishService;

    public List<Day> getMealplan(Date startDate, Date endDate) {
        return dayRepository.findByDateBetween(startDate, endDate);
    }

    public Dish addNewDish(Dish newDish, ApplicationUser user) {

        return dishService.addDish(newDish);
    }

    public boolean addDishToDay(int dishId, Date date, ApplicationUser user) {
        Dish dish = dishService.getDishById(dishId);

        Day day = dayRepository.findDayByDate(date).orElse(null);
        
        // day not exits
        if(day == null)
        {
            Set<Dish> dishes = new HashSet<Dish>();
            dishes.add(dish);

            Day newDay = new Day(date, false, dishes);

            try {
                dayRepository.save(newDay);
            } catch (DataAccessException e) {
                return false;
            }
        }
        else
        {
            if(day.getDishes().contains(dish))
            {
                return false;
            }
            day.addDish(dish);

            try {
                dayRepository.save(day);
            } catch (DataAccessException e) {
                return false;
            }
        }
        return true;
    }
}

