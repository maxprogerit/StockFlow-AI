package com.stockflow.backend.repository;

import com.stockflow.backend.domain.inventory.Inventory;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    List<Inventory> findByOwnerIdAndWarehouseId(UUID ownerId, UUID warehouseId);
    List<Inventory> findByOwnerIdAndProductId(UUID ownerId, UUID productId);
    List<Inventory> findByOwnerId(UUID ownerId);
    boolean existsByOwnerIdAndWarehouseId(UUID ownerId, UUID warehouseId);

    @Query("""
            select i from Inventory i
            where i.owner.id = :ownerId
              and (:warehouseId is null or i.warehouse.id = :warehouseId)
              and (:productId is null or i.product.id = :productId)
              and (
                :query is null or trim(:query) = ''
                or lower(i.product.name) like lower(concat('%', :query, '%'))
                or lower(i.product.sku) like lower(concat('%', :query, '%'))
                or lower(i.product.barcode) like lower(concat('%', :query, '%'))
              )
            """)
    Page<Inventory> search(@Param("ownerId") UUID ownerId, @Param("warehouseId") UUID warehouseId, @Param("productId") UUID productId, @Param("query") String query, Pageable pageable);
}

