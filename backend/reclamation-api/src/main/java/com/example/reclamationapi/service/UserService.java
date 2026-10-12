package com.example.reclamationapi.service;

import com.example.reclamationapi.model.User;
import com.example.reclamationapi.model.Role;
import com.example.reclamationapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(User user) {
        user.setEmail(user.getEmail().trim().toLowerCase());
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Cette adresse email est déjà utilisée");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole(Role.CLIENT);
        }
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public Optional<User> findFirstAgent() {
        return userRepository.findFirstByRoleOrderByIdAsc(Role.AGENT);
    }
}
