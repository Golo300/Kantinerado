package com.app.kantinerado.repository;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.models.mealplan.DishCategory;
import com.app.kantinerado.models.mealplan.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface DishCategoryRepository extends JpaRepository<DishCategory, Integer> {


    Optional<DishCategory> findByName(String name);
}
