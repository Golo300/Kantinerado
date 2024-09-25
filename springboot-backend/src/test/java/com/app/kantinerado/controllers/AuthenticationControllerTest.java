package com.app.kantinerado.controllers;

import com.app.kantinerado.models.LoginDTO;
import com.app.kantinerado.models.RegistrationDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AuthenticationControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    public void setMockMvc(WebApplicationContext context) {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    public void testRegisterUserLogin_Success() throws Exception {
        // Arrange
        final String username = "testUser";
        final String password = "password";

        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(1234);
        registrationDTO.setUsername(username);
        registrationDTO.setEmail("email@test.com");
        registrationDTO.setPassword(password);

        // Register the user
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isCreated());

        // Login with the registered user
        LoginDTO loginDTO = new LoginDTO(username, password);

        ResultActions resultActions = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        // Assert the login response contains the correct username
        String responseString = resultActions.andReturn().getResponse().getContentAsString();
        assertTrue(responseString.contains(username));
    }

    @Test
    public void testRegisterDup_Failure() throws Exception {
        final String username = "testUser";
        final String password = "password";
        final int employeeId = 1234;
        final String email = "email@test.com";

        // Register the first user
        RegistrationDTO registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(employeeId);
        registrationDTO.setUsername(username);
        registrationDTO.setEmail(email);
        registrationDTO.setPassword(password);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isCreated());

        // Attempt to register a second user with the same employee ID
        registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(employeeId);
        registrationDTO.setUsername("testUser2");
        registrationDTO.setEmail("email2@test.com");
        registrationDTO.setPassword(password);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isBadRequest());

        // Attempt to register a second user with the same username
        registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(12345);
        registrationDTO.setUsername(username);
        registrationDTO.setEmail("email3@test.com");
        registrationDTO.setPassword(password);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isBadRequest());

        // Attempt to register a second user with the same email
        registrationDTO = new RegistrationDTO();
        registrationDTO.setEmployeeId(12346);
        registrationDTO.setUsername("testUser3");
        registrationDTO.setEmail(email);
        registrationDTO.setPassword(password);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isBadRequest());
    }
}
