package com.stockflow.backend.controller;

import com.stockflow.backend.domain.supplier.Supplier;
import com.stockflow.backend.repository.SupplierRepository;
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
@RequestMapping("/api/suppliers")
public class SupplierController {
    private final CrudService<Supplier> service;

    public SupplierController(SupplierRepository repository) {
        this.service = new CrudService<>(repository, "Supplier");
    }

    @GetMapping
    public List<Supplier> list() {
        return service.list();
    }

    @PostMapping
    public Supplier create(@RequestBody Supplier supplier) {
        return service.create(supplier);
    }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable UUID id, @RequestBody Supplier supplier) {
        supplier.setId(id);
        return service.update(id, supplier);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}

