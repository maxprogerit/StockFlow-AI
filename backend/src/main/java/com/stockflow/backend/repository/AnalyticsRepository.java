package com.stockflow.backend.repository;

import com.stockflow.backend.domain.analytics.AnalyticsRecord;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsRepository extends JpaRepository<AnalyticsRecord, UUID> {
}

