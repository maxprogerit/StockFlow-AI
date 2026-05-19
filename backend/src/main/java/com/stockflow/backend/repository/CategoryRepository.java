package com.stockflow.backend.repository;

import com.stockflow.backend.domain.catalog.Category;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}

