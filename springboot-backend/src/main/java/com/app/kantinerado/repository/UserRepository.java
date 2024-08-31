package com.app.kantinerado.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.UserDTO;

@Repository
public interface UserRepository extends JpaRepository<ApplicationUser, Integer> {

    @Query("SELECT new com.app.kantinerado.models.UserDTO(u.userId, u.employeeiD , u.username, u.email, u.authorities) FROM ApplicationUser u")
    List<UserDTO> findAllWithoutPasswords();

	Optional<ApplicationUser> findByUsername(String username);

    Optional<ApplicationUser> findByEmail(String email);

    Optional<ApplicationUser> findByEmployeeiD(int employeeiD);
}
