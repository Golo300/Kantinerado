package com.app.kantinerado.models.mealplan;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import com.app.kantinerado.models.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
public class Mealplan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private Integer calendarWeek;

    private boolean planned;

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
            name="mealplan_junktion",
            joinColumns = {@JoinColumn(name="mealplan_id")},
            inverseJoinColumns = {@JoinColumn(name="day_id")}
    )
    private Set<Day> days;

    public Mealplan()
    {
        super();
        days = new HashSet<>();
    }

    public Mealplan(Integer calendarWeek, boolean planned, Set<Day> days)
    {
        super();
        this.days = days;
        this.calendarWeek = calendarWeek;
        this.planned = planned;
    }

    // Getter und Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public void setDays(Set<Day> days) {
        this.days = days;
    }

    public Set<Day> getDays() {
        return this.days;
    }
    public Integer getCalendarWeek() {
        return calendarWeek;
    }

    public void setCalendarWeek(Integer calendarWeek) {
        this.calendarWeek = calendarWeek;
    }

    public boolean isPlanned() {
        return planned;
    }

    public void setPlanned(boolean planned) {
        this.planned = planned;
    }
}

