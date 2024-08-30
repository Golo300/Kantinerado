package com.app.kantinerado.services;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.models.Role;
import com.app.kantinerado.repository.RoleRepository;
import com.app.kantinerado.repository.UserRepository;
import com.app.kantinerado.utils.Roles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Transient;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transient
public class AdminService {

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public RoleRepository roleRepository;

    public Boolean promoteUser(String username)
    {
        Optional<ApplicationUser> userOptional = userRepository.findByUsername(username);

        if(userOptional.isEmpty())
        {
            return false;
        }

        ApplicationUser user = userOptional.get();

        Role canteenRole = roleRepository.findByAuthority(Roles.KANTEEN).get();

        // register main admin
        Set<Role> roles = new HashSet<>();
        roles.add(canteenRole);

        user.setAuthorities(roles);

        userRepository.save(user);

        return true;
    }

    public Boolean deleteAccount(String employeeIdstr)
    {
        int employeeId;
        try {
        employeeId = Integer.parseInt(employeeIdstr);
        } catch (NumberFormatException e) {
            return false;
        }

        Optional<ApplicationUser> userOptional = userRepository.findByEmployeeiD(employeeId);

        if(userOptional.isEmpty())
        {
            return false;
        }

        ApplicationUser user = userOptional.get();

        userRepository.delete(user);

        return true;
    }

    public Boolean demoteUser(String username) {
        Optional<ApplicationUser> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            return false;
        }

        ApplicationUser user = userOptional.get();

        Role userRole = roleRepository.findByAuthority(Roles.USER).get();

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        user.setAuthorities(roles);

        userRepository.save(user);

        return true;
    }

}
