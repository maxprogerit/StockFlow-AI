package com.stockflow.backend.repository;

import com.stockflow.backend.domain.inventory.Inventory;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    List<Inventory> findByWarehouseId(UUID warehouseId);
    List<Inventory> findByProductId(UUID productId);
}

