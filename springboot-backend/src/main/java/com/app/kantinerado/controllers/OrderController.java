package com.app.kantinerado.controllers;

import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.repository.OrderRepository;
import com.app.kantinerado.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    OrderService orderService;

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    @PostMapping("/")
    public ResponseEntity<Order> createOrder(@RequestBody Order body)
    {
        if (orderService.checkOrder(body)) {
            orderRepository.save(body);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } else {
            return  new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
