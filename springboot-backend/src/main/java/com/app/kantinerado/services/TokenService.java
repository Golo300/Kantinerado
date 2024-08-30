package com.app.kantinerado.services;

import java.time.Instant;
import java.util.stream.Collectors;

import com.app.kantinerado.models.ApplicationUser;
import com.app.kantinerado.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.Transient;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

@Service
@Transient
public class TokenService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    private JwtDecoder jwtDecoder;

    public String generateJwt(Authentication auth){

        Instant now = Instant.now();

        String scope = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .subject(auth.getName())
            .claim("roles", scope)
            .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    public ApplicationUser getUserFromAuthentication(Authentication authentication) {

        String username = authentication.getName();
        // Die Rollen können direkt aus dem Authentication-Objekt abgerufen werden
        return userRepository.findByUsername(username).orElse(null);
    }
}
