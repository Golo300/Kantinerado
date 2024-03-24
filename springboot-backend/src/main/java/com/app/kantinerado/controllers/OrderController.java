package com.app.kantinerado.controllers;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.repository.OrderRepository;
import com.app.kantinerado.services.OrderService;
import com.app.kantinerado.services.TokenService;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/order")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    OrderService orderService;

    @Autowired
    private TokenService tokenService;

    @GetMapping("/{kw}")
    public ResponseEntity<List<Order>> getOrderByKw(@PathVariable("kw") Integer kw, @RequestParam(required = false) Integer optionalParameter) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ApplicationUser user = tokenService.getUserFromAuthentication(authentication);

        List<Order> orders = orderService.findOrderBy(kw, user);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<Order>> getAllOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ApplicationUser user = tokenService.getUserFromAuthentication(authentication);

        List<Order> orders = orderService.getAllOders(user);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<String> createOrder(@RequestBody OrderDTO order) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        ApplicationUser user = tokenService.getUserFromAuthentication(authentication);

        boolean response = orderService.placeOrder(order, user);

        if (response) {
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

    @PostMapping("/batchRemove")
    public ResponseEntity<String> deleteOrders(@RequestBody List<Integer> orders) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ApplicationUser user = tokenService.getUserFromAuthentication(authentication);

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
    @GetMapping("/pdf")
    public ResponseEntity<List<Order>> getPdfContent() {
        List<Order> orders = orderService.getEveryOrder();
        return ResponseEntity.ok().body(orders);
    }
}
