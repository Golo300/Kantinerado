package com.app.kantinerado.models.mealplan;

import com.app.kantinerado.models.mealplan.Dish;
import jakarta.persistence.*;

@Entity
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String date;

    private boolean ordered;

    @ManyToOne()
    @JoinColumn(name = "dish_id")
    private Dish dish;

    public Order() {
        super();
    }
    public Order(Integer id, String date, boolean ordered, Dish dish) {
        this.id = id;
        this.date = date;
        this.ordered = ordered;
        this.dish = dish;
    }

    //Getter and Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public boolean isOrdered() {
        return ordered;
    }

    public void setOrdered(boolean ordered) {
        this.ordered = ordered;
    }

    public Dish getDish() {
        return dish;
    }

    public void setDish(Dish dish) {
        this.dish = dish;
    }
}
