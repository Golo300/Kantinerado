package com.app.kantinerado.controllers;

import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.DishCategory;
import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.services.OrderService;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional
public class OrderControllerTest {

    @Autowired
    private OrderService orderService;

    private static Stream<Arguments> testOrders() {
        return Stream.of(
                Arguments.of(

                        new Date(), new Dish(new DishCategory("Menü1", false), "title", "beschreibung", 12.00), new Date(), false,
                        new Date(), new Dish(new DishCategory("Menü2", true), "title", "beschreibung", 12.00), new Date(), true
                )
        );
    }

    @ParameterizedTest
    @MethodSource("testOrders")
    public void testCreateOrder(Date date, Dish dish, Date ordered, Boolean veggie) {
        Order testOrder = new Order(date, veggie, dish, ordered);
        assertEquals(true, orderService.checkOrder(testOrder));
    }

}
