package com.stockflow.backend.service;

import com.stockflow.backend.exception.NotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public class CrudService<T> {
    private final JpaRepository<T, UUID> repository;
    private final String label;

    public CrudService(JpaRepository<T, UUID> repository, String label) {
        this.repository = repository;
        this.label = label;
    }

    public List<T> list() {
        return repository.findAll();
    }

    public T get(UUID id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException(label + " not found"));
    }

    public T create(T entity) {
        return repository.save(entity);
    }

    public T update(UUID id, T entity) {
        get(id);
        return repository.save(entity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}

