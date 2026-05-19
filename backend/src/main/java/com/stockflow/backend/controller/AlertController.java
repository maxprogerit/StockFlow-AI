package com.stockflow.backend.controller;

import com.stockflow.backend.domain.alert.Alert;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.AlertRepository;
import com.stockflow.backend.service.NotificationService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {
    private final AlertRepository alertRepository;
    private final NotificationService notificationService;

    @GetMapping
    public List<Alert> list() {
        return alertRepository.findByResolvedFalseOrderByCreatedAtDesc();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Alert create(@RequestBody Alert alert) {
        Alert saved = alertRepository.save(alert);
        notificationService.publishAlert(saved);
        return saved;
    }

    @PatchMapping("/{id}/resolve")
    public Alert resolve(@PathVariable UUID id) {
        Alert alert = alertRepository.findById(id).orElseThrow(() -> new NotFoundException("Alert not found"));
        alert.setResolved(true);
        return alertRepository.save(alert);
    }
}

