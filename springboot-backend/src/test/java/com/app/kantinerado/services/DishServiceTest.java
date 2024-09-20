package com.app.kantinerado.services;

import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.DishCategory;
import com.app.kantinerado.repository.DishCategoryRepository;
import com.app.kantinerado.repository.DishRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
class DishServiceTest {

    // Konstante Strings für die Gerichte und Kategorien
    private static final String CATEGORY_MENU1 = "Menü1";
    private static final String CATEGORY_MENU2 = "Menü2";
    private static final String CATEGORY_DESSERT = "Dessert";
    private static final String DISH_SCHNITZEL = "Schnitzel";
    private static final String DISH_MAULTASCHEN = "Maultaschen";
    private static final String DISH_KUCHEN = "Kuchen";

    @Mock
    private DishCategoryRepository dishCategoryRepository;

    @Mock
    private DishRepository dishRepository;

    @InjectMocks
    private DishService dishService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetDishesByCategory_Menu1() {
        DishCategory category = new DishCategory();
        category.setName(CATEGORY_MENU1);

        Dish dish = new Dish();
        dish.setTitle(DISH_SCHNITZEL);
        dish.setDishCategory(category);

        when(dishCategoryRepository.findByName(CATEGORY_MENU1)).thenReturn(Optional.of(category));
        when(dishRepository.findByDishCategory(category)).thenReturn(List.of(dish));

        List<Dish> result = dishService.getDishesByCategory(CATEGORY_MENU1);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(DISH_SCHNITZEL, result.get(0).getTitle());
    }

    @Test
    void testGetDishesByCategory_Menu2() {
        DishCategory category = new DishCategory();
        category.setName(CATEGORY_MENU2);

        Dish dish = new Dish();
        dish.setTitle(DISH_MAULTASCHEN);
        dish.setDishCategory(category);

        when(dishCategoryRepository.findByName(CATEGORY_MENU2)).thenReturn(Optional.of(category));
        when(dishRepository.findByDishCategory(category)).thenReturn(List.of(dish));

        List<Dish> result = dishService.getDishesByCategory(CATEGORY_MENU2);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(DISH_MAULTASCHEN, result.get(0).getTitle());
    }

    @Test
    void testGetDishesByCategory_Dessert() {
        DishCategory category = new DishCategory();
        category.setName(CATEGORY_DESSERT);

        Dish dish = new Dish();
        dish.setTitle(DISH_KUCHEN);
        dish.setDishCategory(category);

        when(dishCategoryRepository.findByName(CATEGORY_DESSERT)).thenReturn(Optional.of(category));
        when(dishRepository.findByDishCategory(category)).thenReturn(List.of(dish));

        List<Dish> result = dishService.getDishesByCategory(CATEGORY_DESSERT);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(DISH_KUCHEN, result.get(0).getTitle());
    }

    @Test
    void testCreateDish_Menu1() {
        DishCategory category = new DishCategory();
        category.setName(CATEGORY_MENU1);

        Dish dish = new Dish();
        dish.setTitle(DISH_SCHNITZEL);
        dish.setDishCategory(category);

        when(dishCategoryRepository.findByName(CATEGORY_MENU1)).thenReturn(Optional.of(category));
        when(dishRepository.save(any(Dish.class))).thenAnswer(invocation -> {
            Dish savedDish = invocation.getArgument(0);
            savedDish.setId(1); // Mocking ID after save
            return savedDish;
        });

        int result = dishService.creatDish(dish);

        assertEquals(1, result);
        verify(dishRepository, times(1)).save(dish);
    }

    @Test
    void testCreateDish_Dessert() {
        DishCategory category = new DishCategory();
        category.setName(CATEGORY_DESSERT);

        Dish dish = new Dish();
        dish.setTitle(DISH_KUCHEN);
        dish.setDishCategory(category);

        when(dishCategoryRepository.findByName(CATEGORY_DESSERT)).thenReturn(Optional.of(category));
        when(dishRepository.save(any(Dish.class))).thenAnswer(invocation -> {
            Dish savedDish = invocation.getArgument(0);
            savedDish.setId(2); // Mocking ID after save
            return savedDish;
        });

        int result = dishService.creatDish(dish);

        assertEquals(2, result);
        verify(dishRepository, times(1)).save(dish);
    }

    @Test
    void testGetDishById_DishExists() {
        Dish dish = new Dish();
        dish.setId(1);
        dish.setTitle(DISH_SCHNITZEL);

        when(dishRepository.getReferenceById(1)).thenReturn(dish);

        Dish result = dishService.getDishById(1);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals(DISH_SCHNITZEL, result.getTitle());
    }
}

