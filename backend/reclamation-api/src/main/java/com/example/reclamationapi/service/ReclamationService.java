package com.example.reclamationapi.service;

import com.example.reclamationapi.dto.DashboardStats;
import com.example.reclamationapi.dto.ReclamationRequest;
import com.example.reclamationapi.dto.ReclamationResponse;
import com.example.reclamationapi.model.*;
import com.example.reclamationapi.repository.ReclamationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final UserService userService;

    public Reclamation createReclamation(ReclamationRequest request, User client) {
        if (client == null || client.getRole() != Role.CLIENT) {
            throw new RuntimeException("Seul un client peut créer une réclamation");
        }
        Reclamation reclamation = new Reclamation();
        reclamation.setTitre(request.getTitre());
        reclamation.setDescription(request.getDescription());
        reclamation.setPriorite(request.getPriorite());
        reclamation.setStatut(StatutReclamation.NOUVEAU);
        reclamation.setClient(client);
        // Auto-affectation: le premier agent enregistré prend en charge les nouvelles réclamations.
        userService.findFirstAgent().ifPresent(reclamation::setAgent);
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAllByOrderByDateCreationDesc();
    }

    public List<Reclamation> getReclamationsByClient(User client) {
        return reclamationRepository.findByClientIdOrderByDateCreationDesc(client.getId());
    }

    public Reclamation getReclamationById(Long id) {
        return reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation introuvable"));
    }

    @Transactional
    public Reclamation updateReclamation(Long id, ReclamationRequest request, User currentUser) {
        Reclamation reclamation = getReclamationById(id);
        if (!reclamation.getClient().getId().equals(currentUser.getId()) && !currentUser.getRole().equals(Role.AGENT)) {
            throw new RuntimeException("Vous n'avez pas le droit de modifier cette réclamation");
        }
        if (currentUser.getRole().equals(Role.CLIENT)) {
            reclamation.setTitre(request.getTitre());
            reclamation.setDescription(request.getDescription());
            reclamation.setPriorite(request.getPriorite());
        }
        return reclamationRepository.save(reclamation);
    }

    @Transactional
    public Reclamation changeStatut(Long id, StatutReclamation nouveauStatut, User agent) {
        if (!agent.getRole().equals(Role.AGENT)) {
            throw new RuntimeException("Seul un agent peut changer le statut");
        }
        Reclamation reclamation = getReclamationById(id);
        reclamation.setStatut(nouveauStatut);
        reclamation.setAgent(agent);
        return reclamationRepository.save(reclamation);
    }

    @Transactional
    public Reclamation assignerAgent(Long id, User agent) {
        if (agent == null || agent.getRole() != Role.AGENT) {
            throw new RuntimeException("Seul un agent peut prendre en charge une reclamation");
        }
        Reclamation reclamation = getReclamationById(id);
        reclamation.setAgent(agent);
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> filterByStatut(StatutReclamation statut) {
        return reclamationRepository.findByStatut(statut);
    }

    public List<Reclamation> filterByPriorite(Priorite priorite) {
        return reclamationRepository.findByPriorite(priorite);
    }

    public List<Reclamation> filterByStatutAndPriorite(StatutReclamation statut, Priorite priorite) {
        return reclamationRepository.findByStatutAndPriorite(statut, priorite);
    }

    public DashboardStats getDashboardStats() {
        return getDashboardStats(null);
    }

    public DashboardStats getDashboardStats(User currentUser) {
        List<Reclamation> all = currentUser == null || currentUser.getRole() == Role.AGENT
                ? reclamationRepository.findAllByOrderByDateCreationDesc()
                : reclamationRepository.findByClientIdOrderByDateCreationDesc(currentUser.getId());
        long total = all.size();
        long nouveau = all.stream().filter(r -> r.getStatut() == StatutReclamation.NOUVEAU).count();
        long enCours = all.stream().filter(r -> r.getStatut() == StatutReclamation.EN_COURS).count();
        long resolue = all.stream().filter(r -> r.getStatut() == StatutReclamation.RESOLU).count();
        // Pour simplifier, on calcule les priorités en mémoire (à améliorer avec des requêtes dédiées)
        long haute = all.stream().filter(r -> r.getPriorite() == Priorite.HAUTE).count();
        long moyenne = all.stream().filter(r -> r.getPriorite() == Priorite.MOYENNE).count();
        long faible = all.stream().filter(r -> r.getPriorite() == Priorite.FAIBLE).count();
        return new DashboardStats(total, nouveau, enCours, resolue, haute, moyenne, faible);
    }

    public ReclamationResponse toResponse(Reclamation reclamation) {
        ReclamationResponse response = new ReclamationResponse();
        response.setId(reclamation.getId());
        response.setTitre(reclamation.getTitre());
        response.setDescription(reclamation.getDescription());
        response.setStatut(reclamation.getStatut());
        response.setPriorite(reclamation.getPriorite());
        response.setDateCreation(reclamation.getDateCreation());
        response.setDateModification(reclamation.getDateModification());   // cette méthode existe maintenant
        response.setClientNom(reclamation.getClient() != null ? reclamation.getClient().getNom() : "Non spécifié");
        if (reclamation.getAgent() != null) {
            response.setAgentNom(reclamation.getAgent().getNom());
        }
        return response;
    }
}
