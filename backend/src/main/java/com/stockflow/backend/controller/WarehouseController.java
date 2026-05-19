package com.stockflow.backend.controller;

import com.stockflow.backend.domain.warehouse.Warehouse;
import com.stockflow.backend.repository.WarehouseRepository;
import com.stockflow.backend.service.CrudService;
import java.util.List;
import java.util.UUID;
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
public class WarehouseController {
    private final CrudService<Warehouse> service;

    public WarehouseController(WarehouseRepository repository) {
        this.service = new CrudService<>(repository, "Warehouse");
    }

    @GetMapping
    public List<Warehouse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Warehouse get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PostMapping
    public Warehouse create(@RequestBody Warehouse warehouse) {
        return service.create(warehouse);
    }

    @PutMapping("/{id}")
    public Warehouse update(@PathVariable UUID id, @RequestBody Warehouse warehouse) {
        warehouse.setId(id);
        return service.update(id, warehouse);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}

