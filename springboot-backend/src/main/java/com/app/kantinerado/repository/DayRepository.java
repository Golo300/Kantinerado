package com.app.kantinerado.repository;

import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.models.mealplan.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface DayRepository extends JpaRepository<Day, Integer> {
    Optional<Day> findDayByDishesContains(Dish dish);
    List<Day> findByDateBetween(Date startDate, Date endDate);
    Optional<Day> findDayByDate(Date date);
}
