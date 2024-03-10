package com.app.kantinerado.repository;

import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.models.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE YEAR(o.date) = YEAR(CURRENT_DATE()) AND WEEK(o.date) = :weekNumber AND o.user.userId = :userId")
    List<Order> findByWeekNumber(int weekNumber, Integer userId);

    List<Order> findByUser(ApplicationUser user);
}
