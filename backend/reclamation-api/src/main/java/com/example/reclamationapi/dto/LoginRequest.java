package com.example.reclamationapi.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequest {
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email est invalide")
    private String email;
    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
}
