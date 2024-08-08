package com.app.kantinerado.controllers;

import com.app.kantinerado.models.LoginDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.kantinerado.models.LoginResponseDTO;
import com.app.kantinerado.models.RegistrationDTO;
import com.app.kantinerado.services.AuthenticationService;

import java.net.URI;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegistrationDTO body){
        boolean response = authenticationService.registerUser(body);

        if (response) {
            return ResponseEntity.created(URI.create(body.getUsername())).build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody LoginDTO body){
        return authenticationService.loginUser(body);
    }
}   
