package com.example.reclamationapi.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reclamations")
@Data
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;

    @Enumerated(EnumType.STRING)
    private StatutReclamation statut;

    @Enumerated(EnumType.STRING)
    private Priorite priorite;

    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        dateCreation = now;
        dateModification = now;
    }

    @PreUpdate
    void onUpdate() {
        dateModification = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client; // le client qui a créé

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent; // l'agent qui traite (peut être null)
}
