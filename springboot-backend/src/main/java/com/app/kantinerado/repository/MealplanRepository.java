package com.app.kantinerado.repository;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.Role;
import com.app.kantinerado.models.mealplan.Mealplan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MealplanRepository extends JpaRepository<Mealplan, Integer> {
    Optional<Mealplan> findByCalendarWeek(Integer calendarWeek);
}
