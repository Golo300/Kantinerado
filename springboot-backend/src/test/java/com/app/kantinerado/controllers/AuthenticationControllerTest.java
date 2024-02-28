package com.app.kantinerado.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.LoginResponseDTO;
import com.app.kantinerado.models.RegistrationDTO;
import com.app.kantinerado.services.AuthenticationService;

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
    public void testRegisterUser_Success() {
        // Arrange
        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setUsername("testUser");
        registrationDTO.setPassword("password");

        ApplicationUser expectedUser = new ApplicationUser();
        expectedUser.setUsername(registrationDTO.getUsername());

        // Act
        //ApplicationUser actualUser = authenticationService.registerUser(registrationDTO);

        // Assert
        //assertEquals(expectedUser.getUsername(), actualUser.getUsername());
    }

    @Test
    public void testLoginUser_Success() {
        // Arrange
        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setUsername("admin");
        registrationDTO.setPassword("password");

        ApplicationUser expectedUser = new ApplicationUser();
        expectedUser.setUsername(registrationDTO.getUsername());

        // Act
        //LoginResponseDTO response = authenticationService.loginUser(registrationDTO.getUsername(), registrationDTO.getPassword());

        // Assert
        //assertTrue("" != response.getJwt());
        //assertEquals(expectedUser.getUsername(), response.getUser().getUsername());
    }
}

