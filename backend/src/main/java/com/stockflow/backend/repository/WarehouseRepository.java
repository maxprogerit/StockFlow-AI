package com.stockflow.backend.repository;

import com.stockflow.backend.domain.warehouse.Warehouse;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {
    List<Warehouse> findByOwnerIdOrderByNameAsc(UUID ownerId);
    long countByOwnerId(UUID ownerId);
}

