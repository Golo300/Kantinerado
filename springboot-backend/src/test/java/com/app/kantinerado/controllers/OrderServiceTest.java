package com.app.kantinerado.controllers;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
import com.app.kantinerado.models.Role;
import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.DishCategory;
import com.app.kantinerado.repository.DayRepository;
import com.app.kantinerado.repository.DishRepository;
import com.app.kantinerado.services.OrderService;
import com.app.kantinerado.utils.Roles;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
@Transactional
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @MockBean
    private DayRepository dayRepository;

    @MockBean
    private DishRepository dishRepository;

    /** bullshit test
     @ParameterizedTest
     @MethodSource("provideOrderData")
     void testPlaceOrder(OrderDTO order, ApplicationUser applicationUser, boolean expected) {
         Dish dish = new Dish(new DishCategory("Menü1", false), "title", "description", 9.99);
         Set<Dish> dishes = new HashSet<>();
         dishes.add(dish);
         Day day = new Day(order.getDate(), false, dishes);
         // Definieren von Mock-Verhalten für Repositories
         when(dishRepository.findById(order.getDish_id())).thenReturn(java.util.Optional.of(dish));
         when(dayRepository.findDayByDishesContains(dish)).thenReturn(java.util.Optional.of(day));
         boolean result = orderService.placeOrder(order, applicationUser);
         assertEquals(expected, result);
     }

     private static Stream<Arguments> provideOrderData() {
         Set<Role> roles = new HashSet<>();
         roles.add(new Role(Roles.ADMIN));
         OrderDTO validOrder = new OrderDTO(new Date(), false, 0); // Gültiges Datum

         ApplicationUser validUser = new ApplicationUser(123, "validUser", "valid@example.com", "password", roles);

         // Erstellen von ungültigen Bestellungen für verschiedene Szenarien
         OrderDTO invalidOrder1 = new OrderDTO(new Date(2024 - 1900, 2, 1), true, 33); // Vegetarisch, aber kein Menü 2
         OrderDTO invalidOrder2 = new OrderDTO(new Date(2024 - 1900, 2, 2), false, 33); // Bestellung nach Donnerstag, 18:00 Uhr
         OrderDTO invalidOrder3 = new OrderDTO(new Date(2024 - 1900, 2, 9), false, 33); // Samstag, Menü 1

         return Stream.of(
                 Arguments.of(validOrder, validUser, true), // Gültige Bestellung
                 Arguments.of(invalidOrder1, validUser, false), // Vegetarisch, aber kein Menü 2
                 Arguments.of(invalidOrder2, validUser, false), // Bestellung nach Donnerstag, 18:00 Uhr
                 Arguments.of(invalidOrder3, validUser, false) // Samstag, Menü 1
         );
     }**/
}
