package com.stockflow.backend.controller;

import com.stockflow.backend.domain.analytics.AnalyticsRecord;
import com.stockflow.backend.repository.AnalyticsRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsRepository analyticsRepository;

    @GetMapping
    public List<AnalyticsRecord> list() {
        return analyticsRepository.findAll();
    }

    @PostMapping
    public AnalyticsRecord create(@RequestBody AnalyticsRecord record) {
        return analyticsRepository.save(record);
    }
}

