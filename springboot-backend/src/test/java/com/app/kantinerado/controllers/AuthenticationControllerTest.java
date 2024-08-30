package com.app.kantinerado.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.LoginDTO;
import com.app.kantinerado.models.LoginResponseDTO;
import com.app.kantinerado.models.RegistrationDTO;
import com.app.kantinerado.services.AuthenticationService;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class AuthenticationControllerTest {

    @Autowired
    private AuthenticationService authenticationService;


    @Test
    /**
     * Tests the creation of a new user and the succesfull login
     */
    public void testRegisterUserLogin_Success() {
        // Arrange

        final String username = "testUesr";
        final String password = "password";

        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(1234);
        registrationDTO.setUsername(username);
        registrationDTO.setEmail("email@test.com");
        registrationDTO.setPassword(password);

        // Act
        boolean success = authenticationService.registerUser(registrationDTO);
        assertTrue(success);

        LoginDTO loginDTO = new LoginDTO(username, password);
        LoginResponseDTO response = authenticationService.loginUser(loginDTO);
        // Assert

        assertEquals(username, response.getUser().getUsername());
    }

    @Test
    /**
     * Test that new user can't be created witch same employeeId, username or email
     */
    public void testRegisterDup_Success() {

        final String username = "testUesr";
        final String password = "password";
        final int employeeId = 1234;
        final String email = "email@test.com";

        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(employeeId);
        registrationDTO.setUsername(username);
        registrationDTO.setEmail(email);
        registrationDTO.setPassword(password);

        // Act
        boolean sucess = authenticationService.registerUser(registrationDTO);
        assertTrue(sucess);

        // same id
        registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(employeeId);
        registrationDTO.setUsername("testUser2");
        registrationDTO.setEmail("email2@test.com");
        registrationDTO.setPassword(password);


        // Act
        sucess = authenticationService.registerUser(registrationDTO);
        assertFalse(sucess);


        // same user name
        registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(12344);
        registrationDTO.setUsername(username);
        registrationDTO.setEmail("email3@test.com");
        registrationDTO.setPassword(password);


        // Act
         sucess = authenticationService.registerUser(registrationDTO);
        assertFalse(sucess);


        // same email
        registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(12334);
        registrationDTO.setUsername("testUser3");
        registrationDTO.setEmail(email);
        registrationDTO.setPassword(password);


        // Act
        sucess = authenticationService.registerUser(registrationDTO);
        assertFalse(sucess);

    }
}

