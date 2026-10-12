package com.example.reclamationapi.repository;

import com.example.reclamationapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.example.reclamationapi.model.Role;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findFirstByRoleOrderByIdAsc(Role role);
}
