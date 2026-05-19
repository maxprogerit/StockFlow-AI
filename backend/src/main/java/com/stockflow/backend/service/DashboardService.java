package com.stockflow.backend.service;

import com.stockflow.backend.dto.dashboard.DashboardMetricsDto;
import com.stockflow.backend.repository.CustomerOrderRepository;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.WarehouseRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerOrderRepository customerOrderRepository;

    public DashboardMetricsDto metrics() {
        long lowStock = inventoryRepository.findAll().stream()
                .filter(inv -> inv.getQuantity() != null && inv.getProduct() != null)
                .filter(inv -> inv.getQuantity() <= inv.getProduct().getLowStockThreshold())
                .count();
        return new DashboardMetricsDto(
                productRepository.count(),
                warehouseRepository.count(),
                lowStock,
                BigDecimal.valueOf(customerOrderRepository.count() * 1250L)
        );
    }
}

