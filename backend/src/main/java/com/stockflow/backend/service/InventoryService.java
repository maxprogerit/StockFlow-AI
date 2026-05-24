package com.stockflow.backend.service;

import com.stockflow.backend.domain.inventory.Inventory;
import com.stockflow.backend.domain.inventory.StockMovement;
import com.stockflow.backend.domain.alert.Alert;
import com.stockflow.backend.dto.inventory.InventoryTransferRequest;
import com.stockflow.backend.dto.inventory.InventoryDto;
import com.stockflow.backend.dto.inventory.StockMovementDto;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.StockMovementRepository;
import com.stockflow.backend.repository.WarehouseRepository;
import com.stockflow.backend.repository.AlertRepository;
import com.stockflow.backend.security.CurrentUserService;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockMovementRepository stockMovementRepository;
    private final AlertRepository alertRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public Page<InventoryDto> findAll(UUID warehouseId, UUID productId, String query, Pageable pageable) {
        UUID ownerId = currentUserService.currentUserId();
        return inventoryRepository.search(ownerId, warehouseId, productId, query, pageable).map(this::toDto);
    }

    @Transactional
    public InventoryDto create(InventoryDto dto) {
        var owner = currentUserService.currentUser();
        Inventory inventory = new Inventory();
        inventory.setOwner(owner);
        inventory.setProduct(productRepository.findById(dto.getProductId())
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Product not found")));
        inventory.setWarehouse(warehouseRepository.findById(dto.getWarehouseId())
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Warehouse not found")));
        inventory.setQuantity(dto.getQuantity());
        inventory.setReserved(dto.getReserved() == null ? 0 : dto.getReserved());
        inventory.setBatchNumber(dto.getBatchNumber());
        inventory.setExpiryDate(dto.getExpiryDate());
        Inventory saved = inventoryRepository.save(inventory);
        createMovement(saved, "INBOUND", saved.getQuantity(), "INV-CREATE-" + saved.getId());
        activityLogService.log(owner, "INVENTORY", "CREATE_INVENTORY_RECORD", saved.getProduct().getName());
        return toDto(saved);
    }

    @Transactional
    public InventoryDto updateQuantity(UUID id, Integer quantity) {
        var owner = currentUserService.currentUser();
        Inventory inventory = inventoryRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Inventory item not found"));
        Integer previous = inventory.getQuantity();
        inventory.setQuantity(quantity);
        Inventory saved = inventoryRepository.save(inventory);
        int delta = quantity - (previous == null ? 0 : previous);
        createMovement(saved, delta >= 0 ? "ADJUSTMENT_IN" : "ADJUSTMENT_OUT", Math.abs(delta), "ADJ-" + saved.getId());
        activityLogService.log(owner, "INVENTORY", "ADJUST_QUANTITY", saved.getProduct().getName() + " => " + quantity);
        return toDto(saved);
    }

    @Transactional
    public void transfer(InventoryTransferRequest request) {
        var owner = currentUserService.currentUser();
        if (request.quantity() == null || request.quantity() <= 0) {
            throw new IllegalArgumentException("Transfer quantity must be greater than zero");
        }

        Inventory from = inventoryRepository.findByOwnerIdAndWarehouseId(owner.getId(), request.fromWarehouseId()).stream()
                .filter(inv -> inv.getProduct().getId().equals(request.productId()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Source inventory not found"));
        if (from.getQuantity() < request.quantity()) {
            throw new IllegalArgumentException("Insufficient stock for transfer");
        }

        Inventory to = inventoryRepository.findByOwnerIdAndWarehouseId(owner.getId(), request.toWarehouseId()).stream()
                .filter(inv -> inv.getProduct().getId().equals(request.productId()))
                .findFirst()
                .orElseGet(() -> {
                    Inventory target = new Inventory();
                    target.setOwner(owner);
                    target.setProduct(from.getProduct());
                    target.setWarehouse(warehouseRepository.findById(request.toWarehouseId())
                            .filter(item -> item.getOwner().getId().equals(owner.getId()))
                            .orElseThrow(() -> new NotFoundException("Target warehouse not found")));
                    target.setQuantity(0);
                    target.setReserved(0);
                    return target;
                });

        from.setQuantity(from.getQuantity() - request.quantity());
        to.setQuantity((to.getQuantity() == null ? 0 : to.getQuantity()) + request.quantity());

        inventoryRepository.save(from);
        inventoryRepository.save(to);

        createMovement(from, "TRANSFER_OUT", request.quantity(), "TRF-" + request.productId());
        createMovement(to, "TRANSFER_IN", request.quantity(), "TRF-" + request.productId());
        activityLogService.log(owner, "INVENTORY", "TRANSFER_STOCK", from.getProduct().getName() + " x" + request.quantity());
    }

    @Transactional(readOnly = true)
    public List<StockMovementDto> movementHistory(UUID productId) {
        UUID ownerId = currentUserService.currentUserId();
        List<StockMovement> records = productId == null
                ? stockMovementRepository.findTop20ByOwnerIdOrderByOccurredAtDesc(ownerId)
                : stockMovementRepository.findTop20ByOwnerIdAndProductIdOrderByOccurredAtDesc(ownerId, productId);
        return records.stream().map(this::toMovementDto).toList();
    }

    private void createMovement(Inventory inventory, String type, Integer quantity, String reference) {
        StockMovement movement = new StockMovement();
        movement.setOwner(inventory.getOwner());
        movement.setProduct(inventory.getProduct());
        movement.setWarehouse(inventory.getWarehouse());
        movement.setType(type);
        movement.setQuantity(quantity);
        movement.setReferenceNumber(reference);
        movement.setOccurredAt(Instant.now());
        stockMovementRepository.save(movement);

        if (inventory.getProduct().getLowStockThreshold() != null && inventory.getQuantity() <= inventory.getProduct().getLowStockThreshold()) {
            activityLogService.log(inventory.getOwner(), "ALERTS", "LOW_STOCK_TRIGGER", inventory.getProduct().getName());
            Alert alert = new Alert();
            alert.setOwner(inventory.getOwner());
            alert.setType(inventory.getQuantity() == 0 ? "OUT_OF_STOCK" : "LOW_STOCK");
            alert.setSeverity(inventory.getQuantity() == 0 ? "CRITICAL" : "HIGH");
            alert.setMessage(inventory.getProduct().getName() + " at " + inventory.getWarehouse().getName() + " requires replenishment");
            alert.setResolved(false);
            Alert saved = alertRepository.save(alert);
            notificationService.publishAlert(saved);
        }
    }

    private InventoryDto toDto(Inventory inventory) {
        InventoryDto dto = new InventoryDto();
        dto.setId(inventory.getId());
        dto.setProductId(inventory.getProduct().getId());
        dto.setProductName(inventory.getProduct().getName());
        dto.setSku(inventory.getProduct().getSku());
        dto.setBarcode(inventory.getProduct().getBarcode());
        dto.setCategory(inventory.getProduct().getCategory() != null ? inventory.getProduct().getCategory().getName() : null);
        dto.setWarehouseId(inventory.getWarehouse().getId());
        dto.setWarehouseName(inventory.getWarehouse().getName());
        dto.setQuantity(inventory.getQuantity());
        dto.setReserved(inventory.getReserved());
        dto.setReorderLevel(inventory.getProduct().getLowStockThreshold());
        int qty = inventory.getQuantity() == null ? 0 : inventory.getQuantity();
        int threshold = inventory.getProduct().getLowStockThreshold() == null ? 0 : inventory.getProduct().getLowStockThreshold();
        dto.setStatus(qty == 0 ? "OUT_OF_STOCK" : qty <= threshold ? "LOW_STOCK" : "IN_STOCK");
        dto.setBatchNumber(inventory.getBatchNumber());
        dto.setExpiryDate(inventory.getExpiryDate());
        return dto;
    }

    private StockMovementDto toMovementDto(StockMovement movement) {
        StockMovementDto dto = new StockMovementDto();
        dto.setId(movement.getId());
        dto.setType(movement.getType());
        dto.setQuantity(movement.getQuantity());
        dto.setReferenceNumber(movement.getReferenceNumber());
        dto.setOccurredAt(movement.getOccurredAt());
        dto.setProductId(movement.getProduct().getId());
        dto.setProductName(movement.getProduct().getName());
        dto.setWarehouseId(movement.getWarehouse().getId());
        dto.setWarehouseName(movement.getWarehouse().getName());
        return dto;
    }
}

