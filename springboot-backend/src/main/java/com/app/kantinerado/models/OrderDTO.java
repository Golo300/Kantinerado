package com.app.kantinerado.models;

import com.app.kantinerado.models.mealplan.Dish;
import jakarta.persistence.*;

import java.util.Date;

public class OrderDTO {

    private Date date;
    private boolean veggie;

    private int dish_id;

    public OrderDTO() {
        super();
    }

    public OrderDTO(Date date, boolean veggie, int dish_id) {
        this.date = date;
        this.veggie = veggie;
        this.dish_id = dish_id;
    }

    //Getter and Setter
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

    public int getDish_id() {
        return dish_id;
    }

    public void setDish_id(int dish_id) {
        this.dish_id = dish_id;
    }
}
