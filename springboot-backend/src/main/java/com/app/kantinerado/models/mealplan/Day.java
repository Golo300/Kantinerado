package com.app.kantinerado.models.mealplan;

import jakarta.persistence.*;

import jakarta.persistence.Id;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Day {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String dayofWeek;

    private boolean noFood;

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
            name="day_junktion",
            joinColumns = {@JoinColumn(name="day_id")},
            inverseJoinColumns = {@JoinColumn(name="dish_id")}
    )
    private Set<Dish> dishes;

    public Day()
    {
        super();
        dishes = new HashSet<>();
    }
    public Day(String dayofWeek, boolean noFood, Set<Dish> dishes)
    {
        super();
        this.dishes = dishes;
        this.dayofWeek = dayofWeek;
        this.noFood = noFood;
    }

    // Getter und Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
    public void setDishes(Set<Dish> dishes) {
        this.dishes = dishes;
    }

    public Set<Dish> getDishes() {
        return this.dishes;
    }
    public String getDayofWeek() {
        return dayofWeek;
    }

    public void setDayofWeek(String dayofWeek) {
        this.dayofWeek = dayofWeek;
    }

    public boolean isNoFood() {
        return noFood;
    }

    public void setNoFood(boolean noFood) {
        this.noFood = noFood;
    }
}

