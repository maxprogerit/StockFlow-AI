package com.stockflow.backend.dto.warehouse;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehouseDto {
    private UUID id;
    private String name;
    private String location;
    private Integer capacity;
    private boolean active;
    private Integer stockUnits;
    private BigDecimal inventoryValue;
    private Integer capacityUsagePercent;
}
