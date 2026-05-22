package com.stockflow.backend.domain.inventory;

import com.stockflow.backend.common.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.stockflow.backend.domain.product.Product;
import com.stockflow.backend.domain.user.User;
import com.stockflow.backend.domain.warehouse.Warehouse;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "stock_movements")
public class StockMovement extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    private String type;
    private Integer quantity;
    private String referenceNumber;
    private Instant occurredAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;
}

