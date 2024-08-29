package com.app.kantinerado.services;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.RegistrationDTO;
import com.app.kantinerado.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class AdminServiceTest {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserRepository userRepository;

    @Test
    /**
     * Tests deletion of a user 
     */
    public void testDeleteUser() {
        final String username = "testUser";
        final String password = "password";
        final int employeeId = 1234;

        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(employeeId);
        registrationDTO.setUsername(username);
        registrationDTO.setEmail("email@test.com");
        registrationDTO.setPassword(password);

        boolean sucess = authenticationService.registerUser(registrationDTO);
        assertTrue(sucess);

        Optional<ApplicationUser> userOptional = userRepository.findByEmployeeiD(employeeId);
        assertFalse(userOptional.isEmpty());

        ApplicationUser user = userOptional.get();
        assertEquals(employeeId, user.getEmployeeiD());

        sucess = adminService.deleteAccount(Integer.toString(employeeId));
        assertTrue(sucess);

        userOptional = userRepository.findByEmployeeiD(employeeId);
        assertTrue(userOptional.isEmpty());
    }
}

