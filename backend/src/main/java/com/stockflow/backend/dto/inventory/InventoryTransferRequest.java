package com.stockflow.backend.dto.inventory;

import java.util.UUID;

public record InventoryTransferRequest(
        UUID productId,
        UUID fromWarehouseId,
        UUID toWarehouseId,
        Integer quantity
) {
}
