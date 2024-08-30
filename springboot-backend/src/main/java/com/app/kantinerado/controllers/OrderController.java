package com.app.kantinerado.controllers;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
import com.app.kantinerado.models.mealplan.Order;
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

    private ApplicationUser getAppUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return tokenService.getUserFromAuthentication(authentication);
    }

    @GetMapping("/{kw}")
    public ResponseEntity<List<Order>> getOrderByKw(@PathVariable("kw") Integer kw, @RequestParam(required = false) Integer optionalParameter) {
        ApplicationUser user = getAppUser();

        List<Order> orders = orderService.findOrderBy(kw, user);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<Order>> getAllOrders() {
        ApplicationUser user = getAppUser();

        List<Order> orders = orderService.getAllOders(user);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<String> createOrder(@RequestBody OrderDTO order) {
        ApplicationUser user = getAppUser();

        boolean response = orderService.placeOrder(order, user);

        if (response) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/batch")
    public ResponseEntity<String> createOrders(@RequestBody List<OrderDTO> orders) {
        ApplicationUser user = getAppUser();

        boolean allOrdersPlaced = true;
        for (OrderDTO order : orders) {
            boolean response = orderService.placeOrder(order, user);
            if (!response) {
                allOrdersPlaced = false;
            }
        }

        if (allOrdersPlaced) {
            return new ResponseEntity<>("All orders placed successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Some orders failed to place", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/batchRemove")
    public ResponseEntity<String> deleteOrders(@RequestBody List<Integer> orders) {
        ApplicationUser user = getAppUser();

        boolean allOrdersDeleted = true;
        for (Integer order : orders) {
            boolean response = orderService.deleteOrder(order, user);
            if (!response) {
                allOrdersDeleted = false;
            }
        }

        if (allOrdersDeleted) {
            return new ResponseEntity<>("All orders placed successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Some orders failed to place", HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/admin/{kw}")
    public ResponseEntity<List<Order>> getPdfContentByKw(@PathVariable("kw") Integer kw, @RequestParam(required = false) Integer optionalParameter) {
        List<Order> orders = orderService.getEveryOrderByKw(kw);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
}
