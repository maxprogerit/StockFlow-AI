package com.stockflow.backend.domain.order;

import com.stockflow.backend.common.BaseEntity;
import jakarta.persistence.Entity;
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
    private String orderNumber;
    private String customerName;
    private String status;
    private BigDecimal totalAmount;
    private String shipmentTracking;
    private Instant orderedAt;
}

