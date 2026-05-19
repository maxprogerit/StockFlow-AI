package com.stockflow.backend.dto.inventory;

import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryDto {
    private UUID id;
    private UUID productId;
    private UUID warehouseId;
    private Integer quantity;
    private Integer reserved;
    private String batchNumber;
    private LocalDate expiryDate;
}

