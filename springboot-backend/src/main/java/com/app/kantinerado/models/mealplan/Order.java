package com.app.kantinerado.models.mealplan;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "order")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private Date date;

    private Date ordered;
    private boolean veggie;

    @ManyToOne()
    @JoinColumn(name = "dish_id")
    private Dish dish;

    public Order() {
        super();
    }

    public Order(Integer id, Date date, boolean veggie, Dish dish, Date ordered) {
        this.id = id;
        this.date = date;
        this.veggie = veggie;
        this.dish = dish;
        this.ordered = ordered;
    }

    //Getter and Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Date getOrdered() {
        return ordered;
    }

    public void setOrdered(Date ordered) {
        this.ordered = ordered;
    }

    public boolean isVeggie() {
        return veggie;
    }

    public void setVeggie(boolean ordered) {
        this.veggie = ordered;
    }

    public Dish getDish() {
        return dish;
    }

    public void setDish(Dish dish) {
        this.dish = dish;
    }
}