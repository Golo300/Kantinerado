package com.app.kantinerado.repository;

import com.app.kantinerado.models.Role;
import com.app.kantinerado.models.mealplan.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DishRepository extends JpaRepository<Dish, Integer> {

}
