package com.stockflow.backend.dto.product;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {
    private UUID id;
    private String sku;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private BigDecimal cost;
    private Integer lowStockThreshold;
    private String barcode;
    private UUID categoryId;
    private UUID supplierId;
}

