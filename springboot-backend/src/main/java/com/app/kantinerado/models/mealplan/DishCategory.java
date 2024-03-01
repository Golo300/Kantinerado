package com.app.kantinerado.models.mealplan;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

@Entity
public class DishCategory {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;

    private String name;

    boolean canVeggie;

    public DishCategory()
    {
        super();
    }

    public DishCategory(String name, boolean canVeggie)
    {
        super();
        this.name = name;
        this.canVeggie = canVeggie;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isCanVeggie() {
        return canVeggie;
    }

    public void setCanVeggie(boolean canVeggie) {
        this.canVeggie = canVeggie;
    }
}

