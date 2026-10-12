package com.example.reclamationapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long total;
    private long nouveau;
    private long enCours;
    private long resolue;
    private long prioriteHaute;
    private long prioriteMoyenne;
    private long prioriteFaible;
}
