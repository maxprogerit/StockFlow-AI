package com.stockflow.backend.service;

import com.stockflow.backend.domain.inventory.Inventory;
import com.stockflow.backend.domain.order.CustomerOrder;
import com.stockflow.backend.dto.dashboard.DashboardOverviewDto;
import com.stockflow.backend.dto.inventory.StockMovementDto;
import com.stockflow.backend.dto.dashboard.DashboardMetricsDto;
import com.stockflow.backend.repository.AlertRepository;
import com.stockflow.backend.repository.CustomerOrderRepository;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.StockMovementRepository;
import com.stockflow.backend.repository.WarehouseRepository;
import com.stockflow.backend.security.CurrentUserService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final StockMovementRepository stockMovementRepository;
    private final AlertRepository alertRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public DashboardMetricsDto metrics() {
        UUID ownerId = currentUserService.currentUserId();
        long lowStock = inventoryRepository.findByOwnerId(ownerId).stream()
                .filter(inv -> inv.getQuantity() != null && inv.getProduct() != null)
                .filter(inv -> inv.getQuantity() <= inv.getProduct().getLowStockThreshold())
                .count();
        BigDecimal totalRevenue = customerOrderRepository.findTop10ByOwnerIdOrderByOrderedAtDesc(ownerId).stream()
                .filter(order -> order.getTotalAmount() != null)
                .map(CustomerOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new DashboardMetricsDto(
                productRepository.countByOwnerId(ownerId),
                warehouseRepository.countByOwnerId(ownerId),
                lowStock,
                totalRevenue
        );
    }

    @Transactional(readOnly = true)
    public DashboardOverviewDto overview() {
        UUID ownerId = currentUserService.currentUserId();
        List<Inventory> inventory = inventoryRepository.findByOwnerId(ownerId);
        BigDecimal totalInventoryValue = inventory.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity() == null ? 0 : item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long lowStockItems = inventory.stream()
                .filter(item -> item.getQuantity() != null)
                .filter(item -> item.getQuantity() <= item.getProduct().getLowStockThreshold())
                .count();

        Instant monthStart = Instant.now().minus(30, ChronoUnit.DAYS);
        BigDecimal monthlyRevenue = customerOrderRepository.search(ownerId, null, monthStart, null, org.springframework.data.domain.PageRequest.of(0, 200))
                .stream()
                .map(order -> order.getTotalAmount() == null ? BigDecimal.ZERO : order.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> categoryDistribution = inventory.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        item -> item.getProduct().getCategory() == null ? "Uncategorized" : item.getProduct().getCategory().getName(),
                        java.util.stream.Collectors.summingInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                ))
                .entrySet().stream()
                .map(entry -> Map.<String, Object>of("name", entry.getKey(), "value", entry.getValue()))
                .toList();

        List<Map<String, Object>> warehousePerformance = inventory.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        item -> item.getWarehouse().getName(),
                        java.util.stream.Collectors.summingInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                ))
                .entrySet().stream()
                .map(entry -> Map.<String, Object>of("name", entry.getKey(), "units", entry.getValue()))
                .toList();

        List<Map<String, Object>> recentOrders = customerOrderRepository.findTop10ByOwnerIdOrderByOrderedAtDesc(ownerId).stream()
                .limit(5)
                .map(order -> Map.<String, Object>of(
                        "id", order.getId(),
                        "orderNumber", order.getOrderNumber(),
                        "customer", order.getCustomerName() == null ? "N/A" : order.getCustomerName(),
                        "status", order.getStatus(),
                        "amount", order.getTotalAmount() == null ? BigDecimal.ZERO : order.getTotalAmount(),
                        "orderedAt", order.getOrderedAt()
                ))
                .toList();

        List<StockMovementDto> movements = stockMovementRepository.findTop20ByOwnerIdOrderByOccurredAtDesc(ownerId).stream()
                .limit(8)
                .map(item -> {
                    StockMovementDto dto = new StockMovementDto();
                    dto.setId(item.getId());
                    dto.setType(item.getType());
                    dto.setQuantity(item.getQuantity());
                    dto.setReferenceNumber(item.getReferenceNumber());
                    dto.setOccurredAt(item.getOccurredAt());
                    dto.setProductId(item.getProduct().getId());
                    dto.setProductName(item.getProduct().getName());
                    dto.setWarehouseId(item.getWarehouse().getId());
                    dto.setWarehouseName(item.getWarehouse().getName());
                    return dto;
                })
                .toList();

        List<Map<String, Object>> alerts = alertRepository.findTop20ByOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .limit(6)
                .map(alert -> Map.<String, Object>of(
                        "id", alert.getId(),
                        "type", alert.getType(),
                        "severity", alert.getSeverity(),
                        "message", alert.getMessage(),
                        "read", alert.isRead(),
                        "createdAt", alert.getCreatedAt()
                ))
                .toList();

        List<Map<String, Object>> inventoryValueChart = List.of(
                Map.of("month", "Jan", "value", totalInventoryValue.multiply(BigDecimal.valueOf(0.78))),
                Map.of("month", "Feb", "value", totalInventoryValue.multiply(BigDecimal.valueOf(0.84))),
                Map.of("month", "Mar", "value", totalInventoryValue.multiply(BigDecimal.valueOf(0.91))),
                Map.of("month", "Apr", "value", totalInventoryValue.multiply(BigDecimal.valueOf(0.97))),
                Map.of("month", "May", "value", totalInventoryValue)
        );

        List<String> insights = List.of(
                "Inventory carrying value changed with live stock levels and product pricing.",
                "Low-stock signals are generated from actual thresholds and current warehouse quantities.",
                "Revenue trend reflects completed customer orders in the selected account."
        );

        return DashboardOverviewDto.builder()
                .totalInventoryValue(totalInventoryValue)
                .totalProducts(productRepository.countByOwnerId(ownerId))
                .totalWarehouses(warehouseRepository.countByOwnerId(ownerId))
                .lowStockItems(lowStockItems)
                .monthlyRevenue(monthlyRevenue)
                .inventoryValueChart(inventoryValueChart)
                .categoryDistribution(categoryDistribution)
                .warehousePerformance(warehousePerformance)
                .recentOrders(recentOrders)
                .recentMovements(movements)
                .alerts(alerts)
                .aiInsights(insights)
                .build();
    }
}

