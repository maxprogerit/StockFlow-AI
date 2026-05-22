package com.stockflow.backend.repository;

import com.stockflow.backend.domain.order.PurchaseOrder;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {
    List<PurchaseOrder> findTop10ByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}

