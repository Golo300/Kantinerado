package com.app.kantinerado.services;

import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.DishCategory;
import com.app.kantinerado.repository.DishCategoryRepository;
import com.app.kantinerado.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Transient;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Transient
public class DishService {

    @Autowired
    private DishCategoryRepository dishCategoryRepository;

    @Autowired
    private DishRepository dishRepository;

    public List<Dish> getDishesByCategory(String categoryName)
    {
        DishCategory category = dishCategoryRepository.findByName(categoryName).orElse(null);

        if(category == null) return Collections.emptyList();

        return dishRepository.findByDishCategory(category);
    }

    public int creatDish(Dish dish)
    {
        DishCategory category = dishCategoryRepository.findByName(dish.getDishCategory().getName()).orElse(null);
        if(category == null) return -1;

        try {
            dish.setDishCategory(category);
        } catch (DataAccessException e) {
            return -1;
        }
        dishRepository.save(dish);
        return dish.getId();
    }

    public Dish getDishById(int id)
    {
        return dishRepository.getReferenceById(id);
    }
}
