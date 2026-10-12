package com.example.reclamationapi.repository;

import com.example.reclamationapi.model.Reclamation;
import com.example.reclamationapi.model.StatutReclamation;
import com.example.reclamationapi.model.Priorite;
import com.example.reclamationapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findAllByOrderByDateCreationDesc();
    List<Reclamation> findByClientIdOrderByDateCreationDesc(Long clientId);
    List<Reclamation> findByStatut(StatutReclamation statut);
    List<Reclamation> findByPriorite(Priorite priorite);
    List<Reclamation> findByStatutAndPriorite(StatutReclamation statut, Priorite priorite);
    long countByStatut(StatutReclamation statut);   // ajouté
}
