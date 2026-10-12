package com.example.reclamationapi.dto;

import com.example.reclamationapi.model.Priorite;
import lombok.Data;

@Data
public class ReclamationRequest {
    private String titre;
    private String description;
    private Priorite priorite;
}
