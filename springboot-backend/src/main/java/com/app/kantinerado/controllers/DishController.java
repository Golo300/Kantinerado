package com.app.kantinerado.controllers;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.services.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dish")
@CrossOrigin("*")
public class DishController {

    @Autowired
    private DishService dishService;

    @GetMapping("/{category}")
    public ResponseEntity<List<Dish>> getMeaplan(@PathVariable("category") String category)
    {
        List<Dish> dishes = dishService.getDishesByCategory(category);
        if(dishes == null)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dishes, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> creatDish(@RequestBody Dish dish) {

        boolean response = dishService.creatDish(dish);

        if (response) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
