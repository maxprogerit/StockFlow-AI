package com.stockflow.backend.controller;

import com.stockflow.backend.domain.report.Report;
import com.stockflow.backend.repository.ReportRepository;
import com.stockflow.backend.security.CurrentUserService;
import com.stockflow.backend.service.ActivityLogService;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {
    private final ReportRepository reportRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @GetMapping
    public List<Report> list() {
        return reportRepository.findByOwnerIdOrderByCreatedAtDesc(currentUserService.currentUserId());
    }

    @PostMapping
    public Report create(@RequestBody Map<String, String> payload) {
        var owner = currentUserService.currentUser();
        Report report = new Report();
        report.setOwner(owner);
        report.setName(payload.getOrDefault("name", "Generated Report"));
        report.setType(payload.getOrDefault("type", "PDF"));
        report.setStatus("READY");
        report.setFileUrl("/exports/" + report.getName().replace(" ", "-").toLowerCase() + "." + report.getType().toLowerCase());
        report.setGeneratedAt(Instant.now());
        Report saved = reportRepository.save(report);
        activityLogService.log(owner, "REPORTS", "GENERATE_REPORT", saved.getName());
        return saved;
    }
}

