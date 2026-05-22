package com.stockflow.backend.dto.supplier;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierDto {
    private UUID id;
    private String name;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private Double rating;
    private boolean active;
    private int productsCount;
    private int purchaseOrdersCount;
}
