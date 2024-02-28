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

    private boolean veggie;

    @ManyToOne()
    @JoinColumn(name = "dish_id")
    private Dish dish;

    public Order() {
        super();
    }
    public Order(Integer id, Date date, boolean veggie, Dish dish) {
        this.id = id;
        this.date = date;
        this.veggie = veggie;
        this.dish = dish;
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
