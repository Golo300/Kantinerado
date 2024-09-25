package com.app.kantinerado.controllers;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.LoginDTO;
import com.app.kantinerado.models.OrderDTO;
import com.app.kantinerado.models.RegistrationDTO;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.DishCategory;
import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.repository.DishCategoryRepository;
import com.app.kantinerado.repository.DishRepository;
import com.app.kantinerado.repository.OrderRepository;
import com.app.kantinerado.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class OrderControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DishCategoryRepository dishCategoryRepository;

    @Autowired
    private DishRepository dishRepository;

    private String jwtToken;
    private ApplicationUser testUserOrderService;
    private Dish testDish;

    @BeforeEach
    public void setup() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        final String username = "testUserOrderService";
        final String password = "password";

        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(1234);
        registrationDTO.setUsername(username);
        registrationDTO.setEmail("email@test.com");
        registrationDTO.setPassword(password);

        // Register the user
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isCreated());

        DishCategory menu_1 = dishCategoryRepository.save(new DishCategory("Menü1", false));
        testDish = new Dish();
        testDish.setDishCategory(menu_1);
        testDish.setTitle("Schnitzel");
        testDish.setDescription("Schnitzel mit Pommes");
        testDish.setPrice(9.99);
        dishRepository.save(testDish);

        jwtToken = getJwtToken();
        
        testUserOrderService = userRepository.findByEmployeeiD(1234).orElse(null);
    }

    private String getJwtToken() throws Exception {
        LoginDTO loginDTO = new LoginDTO("testUserOrderService", "password");

        MvcResult result = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        JSONObject jsonObject = new JSONObject(response);
        // Get the jwt token
        return jsonObject.getString("jwt");
    }

    @Test
    @WithMockUser(username = "testUserOrderService")
    public void testGetOrderByKw() throws Exception {
        // Create a test order
        Calendar cal = Calendar.getInstance();
        Date date = cal.getTime();

        Order testOrder = new Order(date, false, testDish, new Date(), testUserOrderService);
        orderRepository.save(testOrder);
        System.out.println(orderRepository.findById(testOrder.getId()));

        int kw = cal.get(Calendar.WEEK_OF_YEAR);

        MvcResult result = mockMvc.perform(get("/order/" + kw)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        List<Order> orders = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, Order.class));

        assertEquals(1, orders.size());
        assertEquals(testOrder.getId(), orders.get(0).getId());
    }

    @Test
    @WithMockUser(username = "testUserOrderService")
    public void testCreateOrder() throws Exception {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, 2);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.FRIDAY);
        Date nextWeek = cal.getTime();

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setDate(nextWeek);
        orderDTO.setDish_id(testDish.getId());
        orderDTO.setVeggie(false);

        mockMvc.perform(post("/order/")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderDTO)))
                .andExpect(status().isOk());

        List<Order> orders = orderRepository.findByUser(testUserOrderService);
        assertEquals(1, orders.size());
        assertEquals(testDish.getId(), orders.get(0).getDish().getId());
    }

    @Test
    @WithMockUser(username = "testUserOrderService")
    public void testCreateOrders() throws Exception {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, 2);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.THURSDAY);
        Date nextWeek = cal.getTime();

        List<OrderDTO> orders = new ArrayList<>();
        OrderDTO order1 = new OrderDTO();
        order1.setDate(nextWeek);
        order1.setDish_id(testDish.getId());
        order1.setVeggie(false);
        orders.add(order1);

        cal.set(Calendar.DAY_OF_WEEK, Calendar.FRIDAY);
        nextWeek = cal.getTime();

        OrderDTO order2 = new OrderDTO();
        order2.setDate(nextWeek);
        order2.setDish_id(testDish.getId());
        order2.setVeggie(false);
        orders.add(order2);

        mockMvc.perform(post("/order/batch")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orders)))
                .andExpect(status().isOk());

        List<Order> savedOrders = orderRepository.findByUser(testUserOrderService);
        assertEquals(2, savedOrders.size());
    }

    @Test
    @WithMockUser(username = "testUserOrderService")
    public void testDeleteOrders() throws Exception {
        // Create test orders
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, 1);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.FRIDAY);
        Date nextWeek = cal.getTime();

        Order order1 = new Order(nextWeek, false, testDish, new Date(), testUserOrderService);
        Order order2 = new Order(nextWeek, true, testDish, new Date(), testUserOrderService);
        orderRepository.saveAll(List.of(order1, order2));

        List<Integer> orderIds = List.of(order1.getId(), order2.getId());

        mockMvc.perform(post("/order/batchRemove")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderIds)))
                .andExpect(status().isOk());

        List<Order> remainingOrders = orderRepository.findByUser(testUserOrderService);
        assertTrue(remainingOrders.isEmpty());
    }
}
