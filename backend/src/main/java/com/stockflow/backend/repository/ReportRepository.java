package com.stockflow.backend.repository;

import com.stockflow.backend.domain.report.Report;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}

