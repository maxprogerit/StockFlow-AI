package com.stockflow.backend.dto.dashboard;

import com.stockflow.backend.dto.inventory.StockMovementDto;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardOverviewDto {
    private BigDecimal totalInventoryValue;
    private long totalProducts;
    private long totalWarehouses;
    private long lowStockItems;
    private BigDecimal monthlyRevenue;
    private List<Map<String, Object>> inventoryValueChart;
    private List<Map<String, Object>> categoryDistribution;
    private List<Map<String, Object>> warehousePerformance;
    private List<Map<String, Object>> recentOrders;
    private List<StockMovementDto> recentMovements;
    private List<Map<String, Object>> alerts;
    private List<String> aiInsights;
}
