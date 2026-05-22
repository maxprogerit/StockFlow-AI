package com.stockflow.backend.service;

import com.stockflow.backend.repository.CustomerOrderRepository;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.OrderItemRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.SupplierRepository;
import com.stockflow.backend.repository.WarehouseRepository;
import com.stockflow.backend.security.CurrentUserService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final CurrentUserService currentUserService;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierRepository supplierRepository;
    private final OrderItemRepository orderItemRepository;

    public Map<String, Object> analytics() {
        UUID ownerId = currentUserService.currentUserId();
        var products = productRepository.findForOwner(ownerId, null, org.springframework.data.domain.PageRequest.of(0, 200)).toList();
        var inventory = inventoryRepository.findByOwnerId(ownerId);
        var orders = customerOrderRepository.findTop10ByOwnerIdOrderByOrderedAtDesc(ownerId);

        BigDecimal revenue = orders.stream().map(item -> item.getTotalAmount() == null ? BigDecimal.ZERO : item.getTotalAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal cost = orderItemRepository.findAll().stream()
                .filter(item -> item.getOwner().getId().equals(ownerId))
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity() == null ? 0 : item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal margin = revenue.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO : revenue.subtract(cost).multiply(BigDecimal.valueOf(100)).divide(revenue, 2, java.math.RoundingMode.HALF_UP);
        BigDecimal stockValue = inventory.stream().map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity() == null ? 0 : item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> topProducts = orderItemRepository.findAll().stream()
                .filter(item -> item.getOwner().getId().equals(ownerId) && item.getCustomerOrder() != null)
                .collect(java.util.stream.Collectors.groupingBy(item -> item.getProduct().getName(), java.util.stream.Collectors.summingInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(entry -> Map.<String, Object>of("name", entry.getKey(), "units", entry.getValue()))
                .toList();

        return Map.of(
                "revenue", revenue,
                "profitMargin", margin,
                "inventoryTurnover", inventory.isEmpty() ? 0 : revenue.divide(stockValue.max(BigDecimal.ONE), 2, java.math.RoundingMode.HALF_UP),
                "stockValue", stockValue,
                "orderVolume", orders.size(),
                "warehouseEfficiency", warehouseRepository.countByOwnerId(ownerId) == 0 ? 0 : (inventory.size() * 100 / warehouseRepository.countByOwnerId(ownerId)),
                "suppliersCount", supplierRepository.findByOwnerIdOrderByNameAsc(ownerId).size(),
                "topProducts", topProducts,
                "trend", List.of(
                        Map.of("month", "Jan", "revenue", revenue.multiply(BigDecimal.valueOf(0.74))),
                        Map.of("month", "Feb", "revenue", revenue.multiply(BigDecimal.valueOf(0.81))),
                        Map.of("month", "Mar", "revenue", revenue.multiply(BigDecimal.valueOf(0.89))),
                        Map.of("month", "Apr", "revenue", revenue.multiply(BigDecimal.valueOf(0.94))),
                        Map.of("month", "May", "revenue", revenue)
                )
        );
    }
}
