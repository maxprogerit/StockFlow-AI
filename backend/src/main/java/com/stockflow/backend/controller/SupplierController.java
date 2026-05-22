package com.stockflow.backend.controller;

import com.stockflow.backend.domain.supplier.Supplier;
import com.stockflow.backend.dto.supplier.SupplierDto;
import com.stockflow.backend.service.SupplierService;
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
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService service;

    @GetMapping
    public List<SupplierDto> list() {
        return service.list();
    }

    @PostMapping
    public SupplierDto create(@RequestBody Supplier supplier) {
        return service.create(supplier);
    }

    @PutMapping("/{id}")
    public SupplierDto update(@PathVariable UUID id, @RequestBody Supplier supplier) {
        return service.update(id, supplier);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}

