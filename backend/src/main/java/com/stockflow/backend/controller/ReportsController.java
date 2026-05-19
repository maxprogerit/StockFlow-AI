package com.stockflow.backend.controller;

import com.stockflow.backend.domain.report.Report;
import com.stockflow.backend.repository.ReportRepository;
import java.util.List;
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

    @GetMapping
    public List<Report> list() {
        return reportRepository.findAll();
    }

    @PostMapping
    public Report create(@RequestBody Report report) {
        return reportRepository.save(report);
    }
}

