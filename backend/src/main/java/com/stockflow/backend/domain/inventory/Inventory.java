package com.stockflow.backend.domain.inventory;

import com.stockflow.backend.common.BaseEntity;
import com.stockflow.backend.domain.product.Product;
import com.stockflow.backend.domain.warehouse.Warehouse;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "inventory")
public class Inventory extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    private Integer quantity;
    private Integer reserved = 0;
    private String batchNumber;
    private LocalDate expiryDate;
}

