package com.stockflow.backend.repository;

import com.stockflow.backend.domain.forecast.ForecastRecord;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForecastRepository extends JpaRepository<ForecastRecord, UUID> {
    List<ForecastRecord> findByOwnerIdAndProductIdOrderByCreatedAtDesc(UUID ownerId, UUID productId);
    List<ForecastRecord> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}

