package com.app.kantinerado.repository;

import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.DishCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DishRepository extends JpaRepository<Dish, Integer> {

    Optional<Dish> findById(Integer Id);

    List<Dish> findByDishCategory(DishCategory dishCategory);
}
