package com.stockflow.backend.dto.dashboard;

import java.math.BigDecimal;

public record DashboardMetricsDto(
        long totalProducts,
        long totalWarehouses,
        long lowStockItems,
        BigDecimal totalRevenue
) {
}

