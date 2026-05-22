package com.stockflow.backend.dto.order;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemRequest(
        UUID productId,
        Integer quantity,
        BigDecimal unitPrice
) {
}
