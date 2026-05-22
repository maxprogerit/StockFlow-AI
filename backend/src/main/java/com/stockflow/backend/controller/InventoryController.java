package com.stockflow.backend.controller;

import com.stockflow.backend.dto.inventory.InventoryTransferRequest;
import com.stockflow.backend.dto.inventory.InventoryDto;
import com.stockflow.backend.dto.inventory.StockMovementDto;
import com.stockflow.backend.service.InventoryService;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping
    public Page<InventoryDto> list(
            @RequestParam(required = false) UUID warehouseId,
            @RequestParam(required = false) UUID productId,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return inventoryService.findAll(warehouseId, productId, q, PageRequest.of(page, size));
    }

    @PostMapping
    public InventoryDto create(@RequestBody InventoryDto dto) {
        return inventoryService.create(dto);
    }

    @PatchMapping("/{id}/quantity")
    public InventoryDto updateQuantity(@PathVariable UUID id, @RequestBody Map<String, Integer> payload) {
        return inventoryService.updateQuantity(id, payload.getOrDefault("quantity", 0));
    }

    @PostMapping("/transfer")
    public void transfer(@RequestBody InventoryTransferRequest request) {
        inventoryService.transfer(request);
    }

    @GetMapping("/movements")
    public List<StockMovementDto> movements(@RequestParam(required = false) UUID productId) {
        return inventoryService.movementHistory(productId);
    }
}

