package com.app.kantinerado.services;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.RegistrationDTO;
import com.app.kantinerado.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import static org.mockito.Mockito.*;
import com.app.kantinerado.models.Role;
import com.app.kantinerado.repository.RoleRepository;
import com.app.kantinerado.utils.Roles;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AdminServiceTest {

    private AdminService adminService;
    
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserRepository userRepositoryNoMock;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        adminService = new AdminService();
        adminService.userRepository = userRepository;
        adminService.roleRepository = roleRepository;
    }

    @Test
    /**
     * Tests deletion of a user 
     */
    public void testDeleteUser() {

        adminService.userRepository = userRepositoryNoMock;

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

        Optional<ApplicationUser> userOptional = userRepositoryNoMock.findByEmployeeiD(employeeId);
        assertFalse(userOptional.isEmpty());

        ApplicationUser user = userOptional.get();
        assertEquals(employeeId, user.getEmployeeiD());

        sucess = adminService.deleteAccount(Integer.toString(employeeId));
        assertTrue(sucess);

        userOptional = userRepositoryNoMock.findByEmployeeiD(employeeId);
        assertTrue(userOptional.isEmpty());
    }


    @Test
    public void testPromoteUser_Success() {
        // Arrange
        final String username = "testUser";
        ApplicationUser user = new ApplicationUser();
        user.setUsername(username);

        Role canteenRole = new Role();
        canteenRole.setAuthority(Roles.KANTEEN);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(roleRepository.findByAuthority(Roles.KANTEEN)).thenReturn(Optional.of(canteenRole));

        // Act
        boolean success = adminService.promoteUser(username);

        // Assert
        assertTrue(success);
        assertEquals(1, user.getAuthorities().size());
        assertTrue(user.getAuthorities().contains(canteenRole));
    }

    @Test
    public void testPromoteUser_UserNotFound() {
        // Arrange
        final String username = "nonExistingUser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        boolean success = adminService.promoteUser(username);

        // Assert
        assertFalse(success);
    }

    @Test
    public void testDemoteUser_Success() {
        // Arrange
        final String username = "testUser";
        ApplicationUser user = new ApplicationUser();
        user.setUsername(username);

        Role userRole = new Role();
        userRole.setAuthority(Roles.USER);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(roleRepository.findByAuthority(Roles.USER)).thenReturn(Optional.of(userRole));

        // Act
        boolean success = adminService.demoteUser(username);

        // Assert
        assertTrue(success);
        assertEquals(1, user.getAuthorities().size());
        assertTrue(user.getAuthorities().contains(userRole));
    }

    @Test
    public void testDemoteUser_UserNotFound() {
        // Arrange
        final String username = "nonExistingUser";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        boolean success = adminService.demoteUser(username);

        // Assert
        assertFalse(success);
    }
}
