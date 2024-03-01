package com.app.kantinerado.services;

import java.util.HashSet;
import java.util.Set;

import com.app.kantinerado.models.*;
import com.app.kantinerado.utils.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.kantinerado.repository.RoleRepository;
import com.app.kantinerado.repository.UserRepository;

@Service
@Transactional
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    public boolean registerUser(RegistrationDTO newUser){

        if (!userRepository.findByUsername(newUser.getUsername()).isEmpty()) {
            return false;
        }

        if (!userRepository.findByEmail(newUser.getEmail()).isEmpty()) {
            return false;
        }
        if (!userRepository.findByEmployeeiD(newUser.getEmployeeId()).isEmpty()) {
            return false;
        }

        String encodedPassword = passwordEncoder.encode(newUser.getPassword());
        Role userRole = roleRepository.findByAuthority(Roles.USER).orElseThrow(() -> new ExpressionException("User role not found"));

        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);

        ApplicationUser user = new ApplicationUser(newUser.getEmployeeId(), newUser.getUsername(), newUser.getEmail(), encodedPassword, authorities);
        userRepository.save(user);

        return true;
    }

    public LoginResponseDTO loginUser(LoginDTO user){

        try{
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            String token = tokenService.generateJwt(auth);

            return new LoginResponseDTO(userRepository.findByUsername(user.getUsername()).get(), token);

        } catch(AuthenticationException e){
            return new LoginResponseDTO(null, "");
        }
    }

}
