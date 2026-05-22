package com.stockflow.backend.repository;

import com.stockflow.backend.domain.company.Company;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
    Optional<Company> findByOwnerId(UUID ownerId);
}
