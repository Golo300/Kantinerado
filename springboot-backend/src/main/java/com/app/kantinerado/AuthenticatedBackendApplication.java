package com.app.kantinerado;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.Role;
import com.app.kantinerado.models.mealplan.Day;
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
import java.util.Date;
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
    CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository,
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
            DishCategory menu_2 = dishCategoryRepository.save(new DishCategory("Menü2", true));
            DishCategory suppe = dishCategoryRepository.save(new DishCategory("Soup", false));
            DishCategory dessert = dishCategoryRepository.save(new DishCategory("Dessert", false));

            Dish dish1 = new Dish();
            dish1.setDishCategory(menu_1);
            dish1.setTitle("Schnitzel");
            dish1.setDescription("Schnitzel mit Pommes");
            dish1.setPrice(9.99);
            dishRepository.save(dish1);

            Dish dish3 = new Dish();
            dish3.setDishCategory(menu_2);
            dish3.setTitle("Maultaschen");
            dish3.setDescription("Maultaschen Schwäbischer Art");
            dish3.setPrice(6.99);
            dishRepository.save(dish3);

            Dish dish4 = new Dish();
            dish4.setDishCategory(suppe);
            dish4.setTitle("Peking Suppe");
            dish4.setDescription("Peking Suppe");
            dish4.setPrice(3.99);
            dishRepository.save(dish4);

            Dish dish2 = new Dish();
            dish2.setDishCategory(dessert);
            dish2.setTitle("Kuchen");
            dish2.setDescription("Bannanenkuchen");
            dish2.setPrice(4.99);
            dishRepository.save(dish2);
        };
    }
}
