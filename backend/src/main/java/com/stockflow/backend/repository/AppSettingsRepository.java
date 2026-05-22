package com.stockflow.backend.repository;

import com.stockflow.backend.domain.settings.AppSettings;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppSettingsRepository extends JpaRepository<AppSettings, UUID> {
    Optional<AppSettings> findByOwnerId(UUID ownerId);
}
