package com.example.reclamationapi.controller;

import com.example.reclamationapi.dto.DashboardStats;
import com.example.reclamationapi.service.ReclamationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.reclamationapi.model.User;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ReclamationService reclamationService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        DashboardStats stats = reclamationService.getDashboardStats(currentUser);
        return ResponseEntity.ok(stats);
    }
}
