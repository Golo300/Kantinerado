package com.app.kantinerado.controllers;

import com.app.kantinerado.models.mealplan.Mealplan;
import com.app.kantinerado.services.MealplanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mealplan")
@CrossOrigin("*")
public class MealplanController {

    @Autowired
    MealplanService mealplanService;

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

}
