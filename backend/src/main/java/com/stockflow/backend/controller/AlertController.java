package com.stockflow.backend.controller;

import com.stockflow.backend.domain.alert.Alert;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.AlertRepository;
import com.stockflow.backend.security.CurrentUserService;
import com.stockflow.backend.service.NotificationService;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {
    private final AlertRepository alertRepository;
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<Alert> list(@RequestParam(required = false) String severity) {
        UUID ownerId = currentUserService.currentUserId();
        List<Alert> alerts = alertRepository.findTop20ByOwnerIdOrderByCreatedAtDesc(ownerId);
        if (severity == null || severity.isBlank()) {
            return alerts;
        }
        return alerts.stream().filter(item -> severity.equalsIgnoreCase(item.getSeverity())).toList();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Alert create(@RequestBody Alert alert) {
        alert.setOwner(currentUserService.currentUser());
        Alert saved = alertRepository.save(alert);
        notificationService.publishAlert(saved);
        return saved;
    }

    @PatchMapping("/{id}/resolve")
    public Alert resolve(@PathVariable UUID id) {
        UUID ownerId = currentUserService.currentUserId();
        Alert alert = alertRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(ownerId))
                .orElseThrow(() -> new NotFoundException("Alert not found"));
        alert.setResolved(true);
        return alertRepository.save(alert);
    }

    @PatchMapping("/{id}/read")
    public Alert read(@PathVariable UUID id, @RequestBody(required = false) Map<String, Boolean> payload) {
        UUID ownerId = currentUserService.currentUserId();
        Alert alert = alertRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(ownerId))
                .orElseThrow(() -> new NotFoundException("Alert not found"));
        boolean read = payload != null && payload.getOrDefault("read", true);
        alert.setRead(read);
        return alertRepository.save(alert);
    }

    @PatchMapping("/read-all")
    public void readAll() {
        UUID ownerId = currentUserService.currentUserId();
        List<Alert> alerts = alertRepository.findTop20ByOwnerIdOrderByCreatedAtDesc(ownerId);
        alerts.forEach(item -> item.setRead(true));
        alertRepository.saveAll(alerts);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        UUID ownerId = currentUserService.currentUserId();
        Alert alert = alertRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(ownerId))
                .orElseThrow(() -> new NotFoundException("Alert not found"));
        alertRepository.delete(alert);
    }
}

