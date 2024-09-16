package com.app.kantinerado.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class UserServiceTest {

    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService();
        userService.userRepository = userRepository;
        userService.passwordEncoder = passwordEncoder;
    }

    @Test
    public void testLoadUserByUsername_UserExists() {
        String username = "testUser";
        ApplicationUser user = new ApplicationUser();
        user.setUsername(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        UserDetails userDetails = userService.loadUserByUsername(username);

        assertNotNull(userDetails);
        assertEquals(username, userDetails.getUsername());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    public void testLoadUserByUsername_UserNotFound() {
        String username = "nonExistingUser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername(username));
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    public void testUpdatePassword_Success() {
        String username = "testUser";
        String currentPassword = "currentPassword";
        String newPassword = "newPassword";
        ApplicationUser user = new ApplicationUser();
        user.setUsername(username);
        user.setPassword(currentPassword);

        when(passwordEncoder.encode(newPassword)).thenReturn("encodedPassword");
        when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(true);

        boolean success = userService.updatePassword(user, newPassword, currentPassword);

        assertTrue(success);
        assertEquals("encodedPassword", user.getPassword());
        verify(userRepository, times(1)).save(user);
        verify(passwordEncoder, times(1)).encode(newPassword);
    }
}
