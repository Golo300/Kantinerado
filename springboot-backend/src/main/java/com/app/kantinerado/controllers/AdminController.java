package com.app.kantinerado.controllers;

import com.app.kantinerado.models.PromoteDTO;
import com.app.kantinerado.services.AdminService;
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
    public String helloAdmineController(){
        return "Admin level access";
    }

    @PostMapping("/promote")
    public ResponseEntity<String> promoteUser(@RequestBody PromoteDTO promote){
        Boolean succes = adminService.promoteUser(promote.getUsername());

        if(succes)
        {
            return ResponseEntity.ok(promote.getUsername() + " got promoted");
        }
        else
        {
            return ResponseEntity.notFound().build();
        }
    }

}
