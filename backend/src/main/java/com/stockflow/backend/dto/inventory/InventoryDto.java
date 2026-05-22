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
    private String productName;
    private String sku;
    private String barcode;
    private String category;
    private UUID warehouseId;
    private String warehouseName;
    private Integer quantity;
    private Integer reserved;
    private Integer reorderLevel;
    private String status;
    private String batchNumber;
    private LocalDate expiryDate;
}

