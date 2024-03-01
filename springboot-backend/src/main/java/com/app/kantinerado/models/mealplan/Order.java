package com.app.kantinerado.models.mealplan;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.OrderDTO;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "meal_order") // can not be order
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

    @ManyToOne()
    @JoinColumn(name = "applicationUser_id")
    private ApplicationUser user;

    public Order() {
        super();
    }

    public Order(OrderDTO orderDTO, Dish dish, ApplicationUser user)
    {
        this.date = orderDTO.getDate();
        this.dish = dish;
        this.veggie = orderDTO.isVeggie();
        this.ordered = new Date();
        this.user = user;
    }

    public Order(Date date, boolean veggie, Dish dish, Date ordered, ApplicationUser user) {
        this.date = date;
        this.veggie = veggie;
        this.dish = dish;
        this.ordered = ordered;
        this.user = user;
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

    public ApplicationUser getUser() { return user; }

    public void setUser(ApplicationUser user) {
        this.user = user;
    }
}
