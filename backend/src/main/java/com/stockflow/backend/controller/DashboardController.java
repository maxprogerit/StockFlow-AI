package com.stockflow.backend.controller;

import com.stockflow.backend.dto.dashboard.DashboardMetricsDto;
import com.stockflow.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public DashboardMetricsDto metrics() {
        return dashboardService.metrics();
    }
}

