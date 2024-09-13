package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.kantinerado.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("In the user details service");

        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("user is not valid"));
    }

    public boolean updatePassword(String username, String newPassword) {
        Optional<ApplicationUser> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            ApplicationUser user = userOpt.get();

            String encodedPassword = passwordEncoder.encode(newPassword);

            user.setPassword(encodedPassword);

            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }
}
