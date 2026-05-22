package com.stockflow.backend.repository;

import com.stockflow.backend.domain.inventory.StockMovement;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findTop20ByOwnerIdOrderByOccurredAtDesc(UUID ownerId);
    List<StockMovement> findTop20ByOwnerIdAndProductIdOrderByOccurredAtDesc(UUID ownerId, UUID productId);
}
