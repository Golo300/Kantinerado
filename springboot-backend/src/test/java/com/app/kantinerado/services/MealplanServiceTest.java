package com.app.kantinerado.services;

import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.repository.DayRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class MealplanServiceTest {

    @Mock
    private DayRepository dayRepository;

    @Mock
    private DishService dishService;

    @InjectMocks
    private MealplanService mealplanService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetMealplan() {
        Date startDate = new Date();
        Date endDate = new Date();

        Day day = new Day();
        day.setDate(startDate);

        when(dayRepository.findByDateBetween(startDate, endDate)).thenReturn(List.of(day));

        List<Day> result = mealplanService.getMealplan(startDate, endDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(day.getDate(), result.get(0).getDate());
    }

    @Test
    void testAddDishToDay_DishNotFound() {
        int dishId = 1;
        Date date = new Date();

        when(dishService.getDishById(dishId)).thenReturn(null);

        boolean result = mealplanService.addDishToDay(dishId, date);

        assertFalse(result);
        verify(dayRepository, times(0)).save(any(Day.class));
    }

    @Test
    void testAddDishToDay_DayNotExists() {
        int dishId = 1;
        Date date = new Date();

        Dish dish = new Dish();
        dish.setId(dishId);
        dish.setTitle("Schnitzel");

        when(dishService.getDishById(dishId)).thenReturn(dish);
        when(dayRepository.findDayByDate(date)).thenReturn(Optional.empty());

        boolean result = mealplanService.addDishToDay(dishId, date);

        assertTrue(result);
        verify(dayRepository, times(1)).save(any(Day.class));
    }

    @Test
    void testAddDishToDay_DayExists_DishAlreadyAdded() {
        int dishId = 1;
        Date date = new Date();

        Dish dish = new Dish();
        dish.setId(dishId);
        dish.setTitle("Schnitzel");

        Day day = new Day();
        day.setDate(date);
        day.setDishes(new HashSet<>(Collections.singletonList(dish)));

        when(dishService.getDishById(dishId)).thenReturn(dish);
        when(dayRepository.findDayByDate(date)).thenReturn(Optional.of(day));

        boolean result = mealplanService.addDishToDay(dishId, date);

        assertFalse(result);
        verify(dayRepository, times(0)).save(any(Day.class));
    }

    @Test
    void testAddDishToDay_DayExists_DishNotAdded() {
        int dishId = 1;
        Date date = new Date();

        Dish dish = new Dish();
        dish.setId(dishId);
        dish.setTitle("Schnitzel");

        Day day = new Day();
        day.setDate(date);
        day.setDishes(new HashSet<>());

        when(dishService.getDishById(dishId)).thenReturn(dish);
        when(dayRepository.findDayByDate(date)).thenReturn(Optional.of(day));

        boolean result = mealplanService.addDishToDay(dishId, date);

        assertTrue(result);
        verify(dayRepository, times(1)).save(day);
    }
}
