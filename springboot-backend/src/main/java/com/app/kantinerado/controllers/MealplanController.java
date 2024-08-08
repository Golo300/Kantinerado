package com.app.kantinerado.controllers;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.DayDishDTO;
import com.app.kantinerado.models.mealplan.Day;
import com.app.kantinerado.services.MealplanService;
import com.app.kantinerado.services.TokenService;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
@RestController
@RequestMapping("/mealplan")
@CrossOrigin("*")
public class MealplanController {

    @Autowired
    MealplanService mealplanService;

    @Autowired
    private TokenService tokenService;

    @GetMapping
    public ResponseEntity<List<Day>>mealplan(
            @RequestParam(name = "start_date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(name = "end_date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        if (startDate == null || endDate == null)
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } 
         
        List<Day> mealplan = mealplanService.getMealplan(startDate, endDate);
        
        return new ResponseEntity<>(mealplan, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> addDish(@RequestBody DayDishDTO dayDishDTO) {

        boolean response = mealplanService.addDishToDay(dayDishDTO.getDishId(), dayDishDTO.getDate());

        if (response) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
