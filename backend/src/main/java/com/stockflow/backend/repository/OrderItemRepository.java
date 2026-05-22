package com.stockflow.backend.repository;

import com.stockflow.backend.domain.order.OrderItem;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByOwnerIdAndCustomerOrderId(UUID ownerId, UUID customerOrderId);
    List<OrderItem> findByOwnerIdAndPurchaseOrderId(UUID ownerId, UUID purchaseOrderId);
    List<OrderItem> findByOwnerIdAndProductId(UUID ownerId, UUID productId);
}
