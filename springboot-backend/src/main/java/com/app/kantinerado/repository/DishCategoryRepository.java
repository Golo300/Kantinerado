package com.app.kantinerado.repository;

import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.models.mealplan.DishCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DishCategoryRepository extends JpaRepository<DishCategory, Integer> {

}
