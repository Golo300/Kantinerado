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
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

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
}
