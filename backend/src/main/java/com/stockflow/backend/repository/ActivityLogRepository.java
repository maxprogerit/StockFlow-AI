package com.stockflow.backend.repository;

import com.stockflow.backend.domain.activity.ActivityLog;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findTop20ByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
