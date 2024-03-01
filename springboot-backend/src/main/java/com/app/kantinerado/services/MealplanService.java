package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.Role;
import com.app.kantinerado.models.mealplan.Mealplan;
import com.app.kantinerado.repository.MealplanRepository;
import com.app.kantinerado.repository.RoleRepository;
import com.app.kantinerado.repository.UserRepository;
import com.app.kantinerado.utils.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Transient;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transient
public class MealplanService {

    @Autowired
    private MealplanRepository mealplanRepository;
    public Mealplan findMealPlanbyKw(Integer kw)
    {
        Optional<Mealplan> mealplanOptional = mealplanRepository.findByCalendarWeek(kw);

        return mealplanOptional.orElse(null);

    }
}

