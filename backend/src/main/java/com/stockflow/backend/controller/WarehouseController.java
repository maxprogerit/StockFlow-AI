package com.stockflow.backend.controller;

import com.stockflow.backend.domain.warehouse.Warehouse;
import com.stockflow.backend.dto.warehouse.WarehouseDto;
import com.stockflow.backend.service.WarehouseService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService service;

    @GetMapping
    public List<WarehouseDto> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public WarehouseDto get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PostMapping
    public WarehouseDto create(@RequestBody Warehouse warehouse) {
        return service.create(warehouse);
    }

    @PutMapping("/{id}")
    public WarehouseDto update(@PathVariable UUID id, @RequestBody Warehouse warehouse) {
        return service.update(id, warehouse);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}

