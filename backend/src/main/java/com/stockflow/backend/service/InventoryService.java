package com.stockflow.backend.service;

import com.stockflow.backend.domain.inventory.Inventory;
import com.stockflow.backend.dto.inventory.InventoryDto;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.WarehouseRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public List<InventoryDto> findAll(UUID warehouseId, UUID productId) {
        List<Inventory> records = warehouseId != null
                ? inventoryRepository.findByWarehouseId(warehouseId)
                : productId != null ? inventoryRepository.findByProductId(productId) : inventoryRepository.findAll();
        return records.stream().map(this::toDto).toList();
    }

    @Transactional
    public InventoryDto create(InventoryDto dto) {
        Inventory inventory = new Inventory();
        inventory.setProduct(productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found")));
        inventory.setWarehouse(warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new NotFoundException("Warehouse not found")));
        inventory.setQuantity(dto.getQuantity());
        inventory.setReserved(dto.getReserved() == null ? 0 : dto.getReserved());
        inventory.setBatchNumber(dto.getBatchNumber());
        inventory.setExpiryDate(dto.getExpiryDate());
        return toDto(inventoryRepository.save(inventory));
    }

    @Transactional
    public InventoryDto updateQuantity(UUID id, Integer quantity) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Inventory item not found"));
        inventory.setQuantity(quantity);
        return toDto(inventoryRepository.save(inventory));
    }

    private InventoryDto toDto(Inventory inventory) {
        InventoryDto dto = new InventoryDto();
        dto.setId(inventory.getId());
        dto.setProductId(inventory.getProduct().getId());
        dto.setWarehouseId(inventory.getWarehouse().getId());
        dto.setQuantity(inventory.getQuantity());
        dto.setReserved(inventory.getReserved());
        dto.setBatchNumber(inventory.getBatchNumber());
        dto.setExpiryDate(inventory.getExpiryDate());
        return dto;
    }
}

