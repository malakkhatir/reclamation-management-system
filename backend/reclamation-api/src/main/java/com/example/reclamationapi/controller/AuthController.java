package com.example.reclamationapi.controller;

import com.example.reclamationapi.dto.JwtResponse;
import com.example.reclamationapi.dto.LoginRequest;
import com.example.reclamationapi.dto.RegisterRequest;
import com.example.reclamationapi.model.Role;
import com.example.reclamationapi.model.User;
import com.example.reclamationapi.security.JwtService;
import com.example.reclamationapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        User user = new User();
        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.CLIENT); // par défaut client
        userService.register(user);
        return ResponseEntity.ok("Utilisateur enregistré avec succès");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        String token = jwtService.generateToken(email, authentication.getAuthorities());
        return ResponseEntity.ok(new JwtResponse(token));
    }
}
