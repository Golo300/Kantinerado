package com.app.kantinerado.controllers;

import com.app.kantinerado.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.Role;
import com.app.kantinerado.models.UserDTO;
import com.app.kantinerado.models.ChangePasswordDTO;
import com.app.kantinerado.services.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenService tokenService;

    private ApplicationUser getAppUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return tokenService.getUserFromAuthentication(authentication);
    }

    @GetMapping("/")
    public String helloUserController(){
        return "User access level";
    }

    @PostMapping("/editPassword")
    public ResponseEntity<String> editPassword(@RequestBody ChangePasswordDTO changePassword) {

        ApplicationUser user = getAppUser();

        boolean updated = userService.updatePassword(user, changePassword.getNewPassword(), changePassword.getCurrentPassword());
        if (updated) {
        return new ResponseEntity<>(HttpStatus.OK);
        } else {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/info")
    public ResponseEntity<UserDTO> getUserInfo(){
        ApplicationUser user = getAppUser();

        UserDTO userInfo = new UserDTO(user.getUserId(), user.getEmployeeiD(), user.getUsername(), user.getEmail(), (Role) user.getAuthorities().toArray()[0]); // User has only 1 Role

        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }
}
