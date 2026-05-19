package com.stockflow.backend.repository;

import com.stockflow.backend.domain.supplier.Supplier;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
}

