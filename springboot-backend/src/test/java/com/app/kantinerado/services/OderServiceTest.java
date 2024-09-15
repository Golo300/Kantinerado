package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.DishCategory;
import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.repository.DishRepository;
import com.app.kantinerado.repository.OrderRepository;
import com.app.kantinerado.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Calendar;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private DishRepository dishRepository;

    @Mock
    private UserRepository userRepository;

    private ApplicationUser testUser;
    private Dish testDish;
    private OrderDTO testOrderDTO;

    @BeforeEach
    void setUp() {

        int employeeId = 1;
        int dishId = 1;

        MockitoAnnotations.openMocks(this);

        testUser = new ApplicationUser();
        testUser.setEmployeeiD(employeeId);

        DishCategory category = new DishCategory();
        category.setName("Menü2");
        category.setCanVeggie(true);

        testDish = new Dish();
        testDish.setId(dishId);
        testDish.setDishCategory(category);

        testOrderDTO = new OrderDTO(null, false, dishId);

        when(dishRepository.findById(dishId)).thenReturn(Optional.of(testDish));
    }

    @Test
    void placeOrder_ValidOrder_ReturnsTrue() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, 2);
        testOrderDTO.setDate(cal.getTime());

        when(orderRepository.save(any(Order.class))).thenReturn(new Order());

        assertTrue(orderService.placeOrder(testOrderDTO, testUser));
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void placeOrder_PastDate_ReturnsFalse() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_YEAR, -1);
        testOrderDTO.setDate(cal.getTime());

        assertFalse(orderService.placeOrder(testOrderDTO, testUser));
        assertEquals("Bestellung ist nur bis Donnerstag, 18:00 Uhr für die kommende Woche möglich", orderService.message);
    }

    @Test
    void placeOrder_VeggieNotAllowed_ReturnsFalse() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, 2);
        testOrderDTO.setDate(cal.getTime());
        testOrderDTO.setVeggie(true);

        testDish.getDishCategory().setCanVeggie(false);

        assertFalse(orderService.placeOrder(testOrderDTO, testUser));
        assertEquals("Vegetarisch darf nur gewählt werden, wenn auch Menü 2 gewählt wurde", orderService.message);
    }

    @Test
    void placeOrder_InvalidDishOnSaturday_ReturnsFalse() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, 2);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.SATURDAY);
        testOrderDTO.setDate(cal.getTime());

        testDish.getDishCategory().setName("Menü1");

        assertFalse(orderService.placeOrder(testOrderDTO, testUser));
        assertEquals("Samstags darf kein Menü 1 und keine Suppe bestellt werden", orderService.message);
    }

    @Test
    void placeOrder_AfterDeadline_ReturnsFalse() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.DAY_OF_WEEK, Calendar.FRIDAY);
        cal.set(Calendar.HOUR_OF_DAY, 10);
        testOrderDTO.setDate(cal.getTime());

        assertFalse(orderService.placeOrder(testOrderDTO, testUser));
        assertEquals("Bestellung ist nur bis Donnerstag, 18:00 Uhr für die kommende Woche möglich", orderService.message);
    }

    @Test
    void testDeleteOrder_Success() {
        int orderId = 1;
        ApplicationUser user = new ApplicationUser();
        user.setId(1);

        Order order = new Order();

        order.setId(orderId);

        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, 3);

        order.setDate(cal.getTime());
        order.setUser(user);

        when(orderRepository.getReferenceById(orderId)).thenReturn(order);

        boolean result = orderService.deleteOrder(orderId, user);

        assertTrue(result);
    }

    @Test
    void testDeleteOrder_OrderNotOwnedByUser() {
        int orderId = 1;
        ApplicationUser user = new ApplicationUser();
        user.setId(1);

        ApplicationUser anotherUser = new ApplicationUser();
        anotherUser.setId(2);

        Order order = new Order();
        order.setId(orderId);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, 3);
        order.setDate(cal.getTime()); // Set a date 2 days in the future
        order.setUser(anotherUser);

        when(orderRepository.getReferenceById(orderId)).thenReturn(order);

        boolean result = orderService.deleteOrder(orderId, user);

        assertFalse(result);
        verify(orderRepository, times(0)).deleteById(orderId);
    }

    @Test
    void testDeleteOrder_OrderTooSoonToDelete() {
        int orderId = 1;
        ApplicationUser user = new ApplicationUser();
        user.setId(1);

        Order order = new Order();
        order.setId(orderId);
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, -1);
        order.setDate(cal.getTime()); // Set a date 1 day in the future
        order.setUser(user);

        when(orderRepository.getReferenceById(orderId)).thenReturn(order);

        boolean result = orderService.deleteOrder(orderId, user);

        assertFalse(result);
        verify(orderRepository, times(0)).deleteById(orderId);
    }

}
