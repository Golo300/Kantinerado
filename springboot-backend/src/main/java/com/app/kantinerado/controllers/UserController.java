package com.app.kantinerado.controllers;

import com.app.kantinerado.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String helloUserController(){
        return "User access level";
    }

    @PutMapping("/editPassword/{username}")
    public ResponseEntity<String> editPassword(@PathVariable String username, @RequestBody String newPassword) {
        boolean updated = userService.updatePassword(username, newPassword);
        if (updated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.badRequest().body("User not found or error updating password");
        }
    }

}
