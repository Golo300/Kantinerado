package com.app.kantinerado.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.app.kantinerado.models.PromoteDTO;
import com.app.kantinerado.services.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class AdminControllerTest {

    @Autowired
    private AdminController adminController;

    @MockBean
    private AdminService adminService;

    @Test
    public void testPromoteUser_Success() {
        // Arrange
        final String username = "testUser";
        PromoteDTO promoteDTO = new PromoteDTO();
        promoteDTO.setUsername(username);

        when(adminService.promoteUser(username)).thenReturn(true);

        // Act
        ResponseEntity<String> response = adminController.promoteUser(promoteDTO);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(username + " got promoted", response.getBody());
    }

    @Test
    public void testPromoteUser_NotFound() {
        // Arrange
        final String username = "nonExistingUser";
        PromoteDTO promoteDTO = new PromoteDTO();
        promoteDTO.setUsername(username);

        when(adminService.promoteUser(username)).thenReturn(false);

        // Act
        ResponseEntity<String> response = adminController.promoteUser(promoteDTO);

        // Assert
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    public void testDemoteUser_Success() {
        // Arrange
        final String username = "testUser";
        PromoteDTO demoteDTO = new PromoteDTO();
        demoteDTO.setUsername(username);

        when(adminService.demoteUser(username)).thenReturn(true);

        // Act
        ResponseEntity<String> response = adminController.demoteUser(demoteDTO);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(username + " wurde degradiert", response.getBody());
    }

    @Test
    public void testDemoteUser_NotFound() {
        // Arrange
        final String username = "nonExistingUser";
        PromoteDTO demoteDTO = new PromoteDTO();
        demoteDTO.setUsername(username);

        when(adminService.demoteUser(username)).thenReturn(false);

        // Act
        ResponseEntity<String> response = adminController.demoteUser(demoteDTO);

        // Assert
        assertEquals(404, response.getStatusCodeValue());
    }
}
