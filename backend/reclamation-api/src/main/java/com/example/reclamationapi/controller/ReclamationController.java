package com.example.reclamationapi.controller;

import com.example.reclamationapi.dto.ReclamationRequest;
import com.example.reclamationapi.dto.ReclamationResponse;
import com.example.reclamationapi.model.Reclamation;
import com.example.reclamationapi.model.Role;
import com.example.reclamationapi.model.StatutReclamation;
import com.example.reclamationapi.model.Priorite;
import com.example.reclamationapi.model.User;
import com.example.reclamationapi.service.ReclamationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reclamations")
@RequiredArgsConstructor
public class ReclamationController {

    private final ReclamationService reclamationService;
    // L'utilisateur est déjà authentifié par JwtAuthenticationFilter.

    // Créer une réclamation (client)
    @PostMapping
    public ResponseEntity<ReclamationResponse> createReclamation(
            @AuthenticationPrincipal User client,
            @RequestBody ReclamationRequest request) {
        if (client == null || client.getRole() != Role.CLIENT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Reclamation reclamation = reclamationService.createReclamation(request, client);
        return new ResponseEntity<>(reclamationService.toResponse(reclamation), HttpStatus.CREATED);
    }

    // Récupérer toutes les réclamations (agent) ou celles du client (client)
    @GetMapping
    public ResponseEntity<List<ReclamationResponse>> getAllReclamations(
            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Reclamation> reclamations;
        if (currentUser.getRole() == Role.AGENT) {
            reclamations = reclamationService.getAllReclamations();
        } else {
            reclamations = reclamationService.getReclamationsByClient(currentUser);
        }
        List<ReclamationResponse> responses = reclamations.stream()
                .map(reclamationService::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Récupérer une réclamation par ID
    @GetMapping("/{id}")
    public ResponseEntity<ReclamationResponse> getReclamationById(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Reclamation reclamation = reclamationService.getReclamationById(id);
        // Vérifier si le client a accès à sa propre réclamation
        if (currentUser.getRole() != Role.AGENT && !reclamation.getClient().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(reclamationService.toResponse(reclamation));
    }

    // Mettre à jour une réclamation (client : titre/description/priorité ; agent : tout)
    @PutMapping("/{id}")
    public ResponseEntity<ReclamationResponse> updateReclamation(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestBody ReclamationRequest request) {
        Reclamation updated = reclamationService.updateReclamation(id, request, currentUser);
        return ResponseEntity.ok(reclamationService.toResponse(updated));
    }

    // Changer le statut (agent uniquement)
    @PutMapping("/{id}/statut")
    public ResponseEntity<ReclamationResponse> changeStatut(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestParam StatutReclamation statut) {
        Reclamation updated = reclamationService.changeStatut(id, statut, currentUser);
        return ResponseEntity.ok(reclamationService.toResponse(updated));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ReclamationResponse> assignerAgent(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        if (currentUser.getRole() != Role.AGENT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Reclamation assigned = reclamationService.assignerAgent(id, currentUser);
        return ResponseEntity.ok(reclamationService.toResponse(assigned));
    }

    // Filtres (agent ou client? On peut permettre les filtres pour tous, mais pour l'agent c'est plus logique)
    @GetMapping("/filter")
    public ResponseEntity<List<ReclamationResponse>> filterReclamations(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) StatutReclamation statut,
            @RequestParam(required = false) Priorite priorite) {
        List<Reclamation> reclamations;
        if (currentUser.getRole() == Role.AGENT) {
            if (statut != null && priorite != null) {
                reclamations = reclamationService.filterByStatutAndPriorite(statut, priorite);
            } else if (statut != null) {
                reclamations = reclamationService.filterByStatut(statut);
            } else if (priorite != null) {
                reclamations = reclamationService.filterByPriorite(priorite);
            } else {
                reclamations = reclamationService.getAllReclamations();
            }
        } else {
            // Pour le client, filtrer seulement ses réclamations
            List<Reclamation> clientReclamations = reclamationService.getReclamationsByClient(currentUser);
            // Appliquer les filtres en mémoire (ou on peut ajouter des méthodes dans repository avec clientId)
            reclamations = clientReclamations.stream()
                    .filter(r -> statut == null || r.getStatut() == statut)
                    .filter(r -> priorite == null || r.getPriorite() == priorite)
                    .collect(Collectors.toList());
        }
        List<ReclamationResponse> responses = reclamations.stream()
                .map(reclamationService::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
