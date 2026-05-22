package com.stockflow.backend.dto.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDto {
    private UUID id;
    private String type;
    private String orderNumber;
    private String partnerName;
    private String status;
    private BigDecimal totalAmount;
    private LocalDate expectedDate;
    private Instant createdAt;
    private UUID warehouseId;
    private String warehouseName;
    private List<OrderLineDto> items;
}
