package com.app.kantinerado.controllers;

import com.app.kantinerado.models.PromoteDTO;
import com.app.kantinerado.models.UserDTO;
import com.app.kantinerado.services.AdminService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    AdminService adminService;

    @GetMapping("/")
    public String helloAdminController(){
        return "Admin level access";
    }

    @GetMapping("/users")
    public List<UserDTO> getAllUser(){
        return adminService.findAllWithoutPasswords();
    }

    @PostMapping("/promote")
    public ResponseEntity<String> promoteUser(@RequestBody PromoteDTO promote){
        Boolean success = adminService.promoteUser(promote.getUsername());

        if(success)
        {
            return ResponseEntity.ok(promote.getUsername() + " got promoted");
        }
        else
        {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<String> deleteAccount(@PathVariable String employeeId) {

        Boolean succes = adminService.deleteAccount(employeeId);

        if(succes)
        {
            return ResponseEntity.ok(employeeId + " got deleted");
        }
        else
        {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/demote")
    public ResponseEntity<String> demoteUser(@RequestBody PromoteDTO demote) {
        Boolean success = adminService.demoteUser(demote.getUsername());

        if (success) {
            return ResponseEntity.ok(demote.getUsername() + " got demoted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
