package com.stockflow.backend.repository;

import com.stockflow.backend.domain.alert.Alert;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, UUID> {
    List<Alert> findByResolvedFalseOrderByCreatedAtDesc();
}

