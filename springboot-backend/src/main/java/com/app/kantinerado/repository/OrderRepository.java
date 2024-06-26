package com.app.kantinerado.repository;

import com.app.kantinerado.models.mealplan.Order;
import com.app.kantinerado.models.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE YEAR(o.date) = YEAR(CURRENT_DATE()) AND WEEK(o.date) = :weekNumber AND o.user.userId = :userId")
    List<Order> findByWeekNumberAndUser(int weekNumber, Integer userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Order o WHERE o.id = ?1")
    List<Boolean> deleteById(int orderId);

    List<Order> findByUser(ApplicationUser user);

    @Query("SELECT o FROM Order o WHERE YEAR(o.date) = YEAR(CURRENT_DATE()) AND WEEK(o.date) = :weekNumber")
    List<Order> findOrderByWeekNumber(int weekNumber);
}
