package com.stockflow.backend.dto.inventory;

import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockMovementDto {
    private UUID id;
    private String type;
    private Integer quantity;
    private String referenceNumber;
    private Instant occurredAt;
    private UUID productId;
    private String productName;
    private UUID warehouseId;
    private String warehouseName;
}
