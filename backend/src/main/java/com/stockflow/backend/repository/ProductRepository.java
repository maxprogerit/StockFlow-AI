package com.stockflow.backend.repository;

import com.stockflow.backend.domain.product.Product;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Query("""
            select p from Product p
            where p.owner.id = :ownerId
              and (
                :query is null
                or trim(:query) = ''
                or lower(p.name) like lower(concat('%', :query, '%'))
                or lower(p.sku) like lower(concat('%', :query, '%'))
                or lower(p.barcode) like lower(concat('%', :query, '%'))
              )
            """)
    Page<Product> findForOwner(@Param("ownerId") UUID ownerId, @Param("query") String query, Pageable pageable);

    long countByOwnerId(UUID ownerId);
}

