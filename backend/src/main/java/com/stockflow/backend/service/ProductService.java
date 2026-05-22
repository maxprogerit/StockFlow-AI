package com.stockflow.backend.service;

import com.stockflow.backend.domain.product.Product;
import com.stockflow.backend.dto.product.ProductDto;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.mapper.ProductMapper;
import com.stockflow.backend.repository.CategoryRepository;
import com.stockflow.backend.repository.InventoryRepository;
import com.stockflow.backend.repository.OrderItemRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.SupplierRepository;
import com.stockflow.backend.security.CurrentUserService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductMapper productMapper;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    public Page<ProductDto> findAll(String query, Pageable pageable) {
        UUID ownerId = currentUserService.currentUserId();
        Page<Product> page = productRepository.findForOwner(ownerId, query, pageable);
        return page.map(productMapper::toDto);
    }

    public ProductDto findOne(UUID id) {
        UUID ownerId = currentUserService.currentUserId();
        Product product = productRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(ownerId))
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return productMapper.toDto(product);
    }

    @Transactional
    public ProductDto create(ProductDto dto) {
        var owner = currentUserService.currentUser();
        Product product = productMapper.toEntity(dto);
        product.setOwner(owner);
        hydrateRelations(product, dto);
        if (product.getSku() == null || product.getSku().isBlank()) {
            product.setSku("SKU-" + System.currentTimeMillis());
        }
        if (product.getBarcode() == null || product.getBarcode().isBlank()) {
            product.setBarcode("BAR-" + System.currentTimeMillis());
        }
        Product saved = productRepository.save(product);
        activityLogService.log(owner, "PRODUCTS", "CREATE_PRODUCT", saved.getName());
        return productMapper.toDto(saved);
    }

    @Transactional
    public ProductDto update(UUID id, ProductDto dto) {
        var owner = currentUserService.currentUser();
        Product product = productRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Product not found"));
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        product.setPrice(dto.getPrice());
        product.setCost(dto.getCost());
        product.setLowStockThreshold(dto.getLowStockThreshold());
        hydrateRelations(product, dto);
        Product saved = productRepository.save(product);
        activityLogService.log(owner, "PRODUCTS", "UPDATE_PRODUCT", saved.getName());
        return productMapper.toDto(saved);
    }

    public void delete(UUID id) {
        var owner = currentUserService.currentUser();
        Product product = productRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Product not found"));
        productRepository.delete(product);
        activityLogService.log(owner, "PRODUCTS", "DELETE_PRODUCT", product.getName());
    }

    private void hydrateRelations(Product product, ProductDto dto) {
        UUID ownerId = currentUserService.currentUserId();
        if (dto.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.getCategoryId())
                    .filter(item -> item.getOwner().getId().equals(ownerId))
                    .orElseThrow(() -> new NotFoundException("Category not found")));
        }
        if (dto.getSupplierId() != null) {
            product.setSupplier(supplierRepository.findById(dto.getSupplierId())
                    .filter(item -> item.getOwner().getId().equals(ownerId))
                    .orElseThrow(() -> new NotFoundException("Supplier not found")));
        }
    }

    public Map<String, Object> analytics(UUID id) {
        UUID ownerId = currentUserService.currentUserId();
        Product product = productRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(ownerId))
                .orElseThrow(() -> new NotFoundException("Product not found"));
        int stock = inventoryRepository.findByOwnerIdAndProductId(ownerId, id).stream()
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();
        int sales = orderItemRepository.findByOwnerIdAndProductId(ownerId, id).stream()
                .filter(item -> item.getCustomerOrder() != null)
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();
        List<Map<String, Object>> stockByWarehouse = inventoryRepository.findByOwnerIdAndProductId(ownerId, id).stream()
                .map(item -> Map.<String, Object>of("warehouse", item.getWarehouse().getName(), "quantity", item.getQuantity()))
                .toList();
        return Map.of(
                "productId", id,
                "name", product.getName(),
                "stock", stock,
                "salesUnits", sales,
                "grossRevenue", product.getPrice().multiply(java.math.BigDecimal.valueOf(sales)),
                "stockByWarehouse", stockByWarehouse
        );
    }
}

