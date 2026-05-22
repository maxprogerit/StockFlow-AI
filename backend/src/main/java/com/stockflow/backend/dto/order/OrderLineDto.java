package com.stockflow.backend.dto.order;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderLineDto {
    private UUID productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
}
