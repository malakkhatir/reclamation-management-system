package com.example.reclamationapi.dto;

import com.example.reclamationapi.model.StatutReclamation;
import com.example.reclamationapi.model.Priorite;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReclamationResponse {
    private Long id;
    private String titre;
    private String description;
    private StatutReclamation statut;
    private Priorite priorite;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private String clientNom;
    private String agentNom; // peut être null
}
