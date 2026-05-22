package com.stockflow.backend.domain.order;

import com.stockflow.backend.common.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.stockflow.backend.domain.user.User;
import com.stockflow.backend.domain.warehouse.Warehouse;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "customer_orders")
public class CustomerOrder extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    private String orderNumber;
    private String customerName;
    private String status;
    private BigDecimal totalAmount;
    private String shipmentTracking;
    private Instant orderedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;
}

