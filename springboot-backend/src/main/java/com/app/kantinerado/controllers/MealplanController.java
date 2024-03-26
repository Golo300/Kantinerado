package com.app.kantinerado.controllers;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.mealplan.Mealplan;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.services.MealplanService;
import com.app.kantinerado.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mealplan")
@CrossOrigin("*")
public class MealplanController {

    @Autowired
    MealplanService mealplanService;

    @Autowired
    private TokenService tokenService;

    @GetMapping("/{kw}")
    public ResponseEntity<Mealplan> getMeaplan(@PathVariable("kw") Integer kw, @RequestParam(required = false) Integer optionalParameter)
    {
        Mealplan mealplan = mealplanService.findMealPlanbyKw(kw);
        if(mealplan == null)
        {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(mealplan, HttpStatus.OK);
    }

    @PostMapping("/addMeal")
    public ResponseEntity<Dish> addMeal(@RequestBody Dish newDish) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ApplicationUser user = tokenService.getUserFromAuthentication(authentication);

        Dish createdDish = mealplanService.addNewDish(newDish, user);

        if (true) {
            return new ResponseEntity<Dish>(createdDish, HttpStatus.OK);
        } else {
            return new ResponseEntity<Dish>(createdDish, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/addMealDay/{dishId}/{kw}/{day}")
    public ResponseEntity<String> addMealToDay(@PathVariable int dishId, @PathVariable int kw, @PathVariable int day) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ApplicationUser user = tokenService.getUserFromAuthentication(authentication);

        boolean createdDish = mealplanService.addDishToDay(dishId, kw, day, user);

        if (createdDish) {
            return new ResponseEntity<>("createdDish", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("", HttpStatus.BAD_REQUEST);
        }
    }
}
