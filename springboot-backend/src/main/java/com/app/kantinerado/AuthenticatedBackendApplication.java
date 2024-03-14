package com.app.kantinerado;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.Role;
import com.app.kantinerado.models.mealplan.Dish;
import com.app.kantinerado.models.mealplan.DishCategory;
import com.app.kantinerado.repository.*;
import com.app.kantinerado.services.MealplanService;
import com.app.kantinerado.utils.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class AuthenticatedBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthenticatedBackendApplication.class, args);
    }

    @Autowired
    MealplanService mealplanService;

    @Bean
    CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, MealplanRepository mealplanRepository,
                          DayRepository dayRepository, DishRepository dishRepository, DishCategoryRepository dishCategoryRepository,
                          OrderRepository orderRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            if (roleRepository.findByAuthority("ADMIN").isPresent()) return;

            Role adminRole = roleRepository.save(new Role(Roles.ADMIN));
            Role userRole = roleRepository.save(new Role(Roles.USER));
            Role canteenRole = roleRepository.save(new Role(Roles.KANTEEN));

            // register main admin
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            ApplicationUser admin = new ApplicationUser(123, "admin", "test@test.de",
                    passwordEncoder.encode("password"), roles);

            userRepository.save(admin);

            // Sample DishCategory
            DishCategory menu_1 = dishCategoryRepository.save(new DishCategory("Menü1", false));
            DishCategory dessert = dishCategoryRepository.save(new DishCategory("Dessert", false));

            // Sample Dishes
            Set<Dish> dishes = new HashSet<>();

            Dish dish1 = new Dish();
            dish1.setDishCategory(menu_1);
            dish1.setTitle("Dish 1");
            dish1.setDescription("Description for Dish 1");
            dish1.setPrice(9.99);
            dishRepository.save(dish1);
            dishes.add(dish1);

            Dish dish2 = new Dish();
            dish2.setDishCategory(dessert);
            dish2.setTitle("Dessert 1");
            dish2.setDescription("Description for Dessert 1");
            dish2.setPrice(4.99);
            dishRepository.save(dish2);
            dishes.add(dish2);

            // Sample Mealplans for current and next two weeks
            Calendar calendar = Calendar.getInstance();
            int currentKw = calendar.get(Calendar.WEEK_OF_YEAR);

            // Current week
            mealplanService.createMealplanByKw(2024, currentKw, dishes);

            // Next week
            mealplanService.createMealplanByKw(2024, currentKw + 1, dishes);

            // Next to next week
            mealplanService.createMealplanByKw(2024, currentKw + 2, dishes);
        };
    }
}
