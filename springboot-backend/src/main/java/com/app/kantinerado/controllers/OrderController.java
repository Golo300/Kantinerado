package com.app.kantinerado.controllers;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.repository.OrderRepository;
import com.app.kantinerado.services.OrderService;
import com.app.kantinerado.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    OrderService orderService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/")
    public ResponseEntity<String> createOrder(@RequestBody OrderDTO order) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ApplicationUser user = tokenService.getUserFromAuthentication(authentication);

        boolean response = orderService.placeOrder(order, user);

        if(response)
        {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/batch")
    public ResponseEntity<String> createOrders(@RequestBody List<OrderDTO> orders) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ApplicationUser user = tokenService.getUserFromAuthentication(authentication);

        boolean allOrdersPlaced = true;
        for (OrderDTO order : orders) {
            boolean response = orderService.placeOrder(order, user);
            if (!response) {
                allOrdersPlaced = false;
                // Hier können Sie weitere Fehlerbehandlung durchführen, wenn eine Bestellung fehlschlägt
            }
        }

        if (allOrdersPlaced) {
            return new ResponseEntity<>("All orders placed successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Some orders failed to place", HttpStatus.BAD_REQUEST);
        }
    }
}
