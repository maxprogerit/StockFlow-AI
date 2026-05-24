package com.stockflow.backend.service;

import com.stockflow.backend.domain.inventory.Inventory;
import com.stockflow.backend.domain.order.CustomerOrder;
import com.stockflow.backend.domain.order.OrderItem;
import com.stockflow.backend.domain.order.PurchaseOrder;
import com.stockflow.backend.dto.order.OrderCreateRequest;
import com.stockflow.backend.dto.order.OrderDto;
import com.stockflow.backend.dto.order.OrderLineDto;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.CustomerOrderRepository;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.OrderItemRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.PurchaseOrderRepository;
import com.stockflow.backend.repository.SupplierRepository;
import com.stockflow.backend.repository.WarehouseRepository;
import com.stockflow.backend.security.CurrentUserService;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CustomerOrderRepository customerOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @Transactional(readOnly = true)
    public List<OrderDto> list(String type, String status, String query, int page, int size) {
        UUID ownerId = currentUserService.currentUserId();
        Pageable pageable = PageRequest.of(page, size);
        List<OrderDto> purchase = purchaseOrderRepository.findTop10ByOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .filter(order -> status == null || status.isBlank() || status.equalsIgnoreCase(order.getStatus()))
                .filter(order -> query == null || query.isBlank() || order.getOrderNumber().toLowerCase().contains(query.toLowerCase()))
                .map(this::toPurchaseDto)
                .toList();
        if ("PURCHASE".equalsIgnoreCase(type)) {
            return purchase;
        }
        Page<CustomerOrder> orders = customerOrderRepository.search(ownerId, status, null, query, pageable);
        List<OrderDto> customer = orders.stream().map(this::toCustomerDto).toList();
        if ("CUSTOMER".equalsIgnoreCase(type)) {
            return customer;
        }
        List<OrderDto> merged = new ArrayList<>();
        merged.addAll(customer);
        merged.addAll(purchase);
        return merged.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    @Transactional
    public OrderDto create(OrderCreateRequest request) {
        var owner = currentUserService.currentUser();
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        if ("PURCHASE".equalsIgnoreCase(request.type())) {
            PurchaseOrder order = new PurchaseOrder();
            order.setOwner(owner);
            order.setOrderNumber("PO-" + System.currentTimeMillis());
            order.setStatus(request.status() == null ? "CREATED" : request.status());
            order.setExpectedDate(request.expectedDate());
            order.setWarehouse(warehouseRepository.findById(request.warehouseId())
                    .filter(item -> item.getOwner().getId().equals(owner.getId()))
                    .orElseThrow(() -> new NotFoundException("Warehouse not found")));
            if (request.supplierId() != null) {
                order.setSupplier(supplierRepository.findById(request.supplierId())
                        .filter(item -> item.getOwner().getId().equals(owner.getId()))
                        .orElseThrow(() -> new NotFoundException("Supplier not found")));
            }
            BigDecimal total = BigDecimal.ZERO;
            PurchaseOrder saved = purchaseOrderRepository.save(order);
            List<OrderItem> lines = new ArrayList<>();
            for (var line : request.items()) {
                var product = productRepository.findById(line.productId())
                        .filter(item -> item.getOwner().getId().equals(owner.getId()))
                        .orElseThrow(() -> new NotFoundException("Product not found"));
                BigDecimal unitPrice = line.unitPrice() == null ? product.getCost() : line.unitPrice();
                OrderItem item = new OrderItem();
                item.setOwner(owner);
                item.setPurchaseOrder(saved);
                item.setProduct(product);
                item.setQuantity(line.quantity());
                item.setUnitPrice(unitPrice);
                lines.add(orderItemRepository.save(item));
                total = total.add(unitPrice.multiply(BigDecimal.valueOf(line.quantity())));
            }
            saved.setTotalAmount(total);
            purchaseOrderRepository.save(saved);
            activityLogService.log(owner, "ORDERS", "CREATE_PURCHASE_ORDER", saved.getOrderNumber());
            return toPurchaseDto(saved);
        }

        CustomerOrder order = new CustomerOrder();
        order.setOwner(owner);
        order.setOrderNumber("SO-" + System.currentTimeMillis());
        order.setCustomerName(request.partnerName());
        order.setStatus(request.status() == null ? "CREATED" : request.status());
        order.setOrderedAt(Instant.now());
        order.setWarehouse(warehouseRepository.findById(request.warehouseId())
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Warehouse not found")));
        BigDecimal total = BigDecimal.ZERO;
        CustomerOrder saved = customerOrderRepository.save(order);
        for (var line : request.items()) {
            var product = productRepository.findById(line.productId())
                    .filter(item -> item.getOwner().getId().equals(owner.getId()))
                    .orElseThrow(() -> new NotFoundException("Product not found"));
            BigDecimal unitPrice = line.unitPrice() == null ? product.getPrice() : line.unitPrice();
            OrderItem item = new OrderItem();
            item.setOwner(owner);
            item.setCustomerOrder(saved);
            item.setProduct(product);
            item.setQuantity(line.quantity());
            item.setUnitPrice(unitPrice);
            orderItemRepository.save(item);
            total = total.add(unitPrice.multiply(BigDecimal.valueOf(line.quantity())));
        }
        saved.setTotalAmount(total);
        customerOrderRepository.save(saved);
        activityLogService.log(owner, "ORDERS", "CREATE_CUSTOMER_ORDER", saved.getOrderNumber());
        return toCustomerDto(saved);
    }

    @Transactional
    public OrderDto updateStatus(String type, UUID id, String status) {
        var owner = currentUserService.currentUser();
        if ("PURCHASE".equalsIgnoreCase(type)) {
            PurchaseOrder order = purchaseOrderRepository.findById(id)
                    .filter(item -> item.getOwner().getId().equals(owner.getId()))
                    .orElseThrow(() -> new NotFoundException("Purchase order not found"));
            order.setStatus(status);
            PurchaseOrder saved = purchaseOrderRepository.save(order);
            if ("COMPLETED".equalsIgnoreCase(status)) {
                applyPurchaseInventory(owner.getId(), saved);
            }
            activityLogService.log(owner, "ORDERS", "UPDATE_ORDER_STATUS", saved.getOrderNumber() + " -> " + status);
            return toPurchaseDto(saved);
        }
        CustomerOrder order = customerOrderRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Customer order not found"));
        order.setStatus(status);
        CustomerOrder saved = customerOrderRepository.save(order);
        if ("COMPLETED".equalsIgnoreCase(status)) {
            applyCustomerInventory(owner.getId(), saved);
        }
        activityLogService.log(owner, "ORDERS", "UPDATE_ORDER_STATUS", saved.getOrderNumber() + " -> " + status);
        return toCustomerDto(saved);
    }

    private void applyPurchaseInventory(UUID ownerId, PurchaseOrder order) {
        List<OrderItem> lines = orderItemRepository.findByOwnerIdAndPurchaseOrderId(ownerId, order.getId());
        for (OrderItem line : lines) {
            Inventory inv = inventoryRepository.findByOwnerIdAndWarehouseId(ownerId, order.getWarehouse().getId()).stream()
                    .filter(item -> item.getProduct().getId().equals(line.getProduct().getId()))
                    .findFirst()
                    .orElseGet(() -> {
                        Inventory item = new Inventory();
                        item.setOwner(order.getOwner());
                        item.setWarehouse(order.getWarehouse());
                        item.setProduct(line.getProduct());
                        item.setQuantity(0);
                        item.setReserved(0);
                        return item;
                    });
            inv.setQuantity((inv.getQuantity() == null ? 0 : inv.getQuantity()) + line.getQuantity());
            inventoryRepository.save(inv);
        }
    }

    private void applyCustomerInventory(UUID ownerId, CustomerOrder order) {
        List<OrderItem> lines = orderItemRepository.findByOwnerIdAndCustomerOrderId(ownerId, order.getId());
        for (OrderItem line : lines) {
            Inventory inv = inventoryRepository.findByOwnerIdAndWarehouseId(ownerId, order.getWarehouse().getId()).stream()
                    .filter(item -> item.getProduct().getId().equals(line.getProduct().getId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Inventory not found for product " + line.getProduct().getName()));
            if (inv.getQuantity() < line.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for " + line.getProduct().getName());
            }
            inv.setQuantity(inv.getQuantity() - line.getQuantity());
            inventoryRepository.save(inv);
        }
    }

    private OrderDto toCustomerDto(CustomerOrder order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setType("CUSTOMER");
        dto.setOrderNumber(order.getOrderNumber());
        dto.setPartnerName(order.getCustomerName());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCreatedAt(order.getOrderedAt());
        dto.setWarehouseId(order.getWarehouse() != null ? order.getWarehouse().getId() : null);
        dto.setWarehouseName(order.getWarehouse() != null ? order.getWarehouse().getName() : null);
        dto.setItems(orderItemRepository.findByOwnerIdAndCustomerOrderId(order.getOwner().getId(), order.getId()).stream().map(this::lineDto).toList());
        return dto;
    }

    private OrderDto toPurchaseDto(PurchaseOrder order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setType("PURCHASE");
        dto.setOrderNumber(order.getOrderNumber());
        dto.setPartnerName(order.getSupplier() != null ? order.getSupplier().getName() : "N/A");
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setExpectedDate(order.getExpectedDate());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setWarehouseId(order.getWarehouse() != null ? order.getWarehouse().getId() : null);
        dto.setWarehouseName(order.getWarehouse() != null ? order.getWarehouse().getName() : null);
        dto.setItems(orderItemRepository.findByOwnerIdAndPurchaseOrderId(order.getOwner().getId(), order.getId()).stream().map(this::lineDto).toList());
        return dto;
    }

    private OrderLineDto lineDto(OrderItem item) {
        OrderLineDto dto = new OrderLineDto();
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        return dto;
    }
}
