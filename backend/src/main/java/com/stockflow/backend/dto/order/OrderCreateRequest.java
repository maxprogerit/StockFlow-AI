package com.stockflow.backend.dto.order;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record OrderCreateRequest(
        String type,
        String partnerName,
        UUID supplierId,
        UUID warehouseId,
        String status,
        LocalDate expectedDate,
        List<OrderItemRequest> items
) {
}
