package com.stockflow.backend.service;

import com.stockflow.backend.domain.warehouse.Warehouse;
import com.stockflow.backend.dto.warehouse.WarehouseDto;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.WarehouseRepository;
import com.stockflow.backend.security.CurrentUserService;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @Transactional(readOnly = true)
    public List<WarehouseDto> list() {
        UUID ownerId = currentUserService.currentUserId();
        return warehouseRepository.findByOwnerIdOrderByNameAsc(ownerId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public WarehouseDto get(UUID id) {
        UUID ownerId = currentUserService.currentUserId();
        Warehouse warehouse = warehouseRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(ownerId))
                .orElseThrow(() -> new NotFoundException("Warehouse not found"));
        return toDto(warehouse);
    }

    @Transactional
    public WarehouseDto create(Warehouse warehouse) {
        var owner = currentUserService.currentUser();
        warehouse.setOwner(owner);
        Warehouse saved = warehouseRepository.save(warehouse);
        activityLogService.log(owner, "WAREHOUSES", "CREATE_WAREHOUSE", saved.getName());
        return toDto(saved);
    }

    @Transactional
    public WarehouseDto update(UUID id, Warehouse payload) {
        var owner = currentUserService.currentUser();
        Warehouse warehouse = warehouseRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Warehouse not found"));
        warehouse.setName(payload.getName());
        warehouse.setLocation(payload.getLocation());
        warehouse.setCapacity(payload.getCapacity());
        warehouse.setActive(payload.isActive());
        Warehouse saved = warehouseRepository.save(warehouse);
        activityLogService.log(owner, "WAREHOUSES", "UPDATE_WAREHOUSE", saved.getName());
        return toDto(saved);
    }

    @Transactional
    public void delete(UUID id) {
        var owner = currentUserService.currentUser();
        Warehouse warehouse = warehouseRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Warehouse not found"));
        if (inventoryRepository.existsByOwnerIdAndWarehouseId(owner.getId(), id)) {
            throw new IllegalArgumentException("Warehouse cannot be deleted while inventory exists");
        }
        warehouseRepository.delete(warehouse);
        activityLogService.log(owner, "WAREHOUSES", "DELETE_WAREHOUSE", warehouse.getName());
    }

    private WarehouseDto toDto(Warehouse warehouse) {
        WarehouseDto dto = new WarehouseDto();
        dto.setId(warehouse.getId());
        dto.setName(warehouse.getName());
        dto.setLocation(warehouse.getLocation());
        dto.setCapacity(warehouse.getCapacity());
        dto.setActive(warehouse.isActive());
        var items = inventoryRepository.findByOwnerIdAndWarehouseId(warehouse.getOwner().getId(), warehouse.getId());
        int units = items.stream().mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity()).sum();
        BigDecimal value = items.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity() == null ? 0 : item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setStockUnits(units);
        dto.setInventoryValue(value);
        int capacity = warehouse.getCapacity() == null || warehouse.getCapacity() <= 0 ? 1 : warehouse.getCapacity();
        dto.setCapacityUsagePercent(Math.min(100, (int) Math.round((units * 100.0) / capacity)));
        return dto;
    }
}
