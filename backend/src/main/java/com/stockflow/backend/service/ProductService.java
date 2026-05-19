package com.stockflow.backend.service;

import com.stockflow.backend.domain.product.Product;
import com.stockflow.backend.dto.product.ProductDto;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.mapper.ProductMapper;
import com.stockflow.backend.repository.CategoryRepository;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.SupplierRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductMapper productMapper;

    public Page<ProductDto> findAll(String query, Pageable pageable) {
        Page<Product> page = (query == null || query.isBlank())
                ? productRepository.findAll(pageable)
                : productRepository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(query, query, pageable);
        return page.map(productMapper::toDto);
    }

    public ProductDto findOne(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return productMapper.toDto(product);
    }

    @Transactional
    public ProductDto create(ProductDto dto) {
        Product product = productMapper.toEntity(dto);
        hydrateRelations(product, dto);
        if (product.getSku() == null || product.getSku().isBlank()) {
            product.setSku("SKU-" + System.currentTimeMillis());
        }
        if (product.getBarcode() == null || product.getBarcode().isBlank()) {
            product.setBarcode("BAR-" + System.currentTimeMillis());
        }
        return productMapper.toDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto update(UUID id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        product.setPrice(dto.getPrice());
        product.setCost(dto.getCost());
        product.setLowStockThreshold(dto.getLowStockThreshold());
        hydrateRelations(product, dto);
        return productMapper.toDto(productRepository.save(product));
    }

    public void delete(UUID id) {
        productRepository.deleteById(id);
    }

    private void hydrateRelations(Product product, ProductDto dto) {
        if (dto.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found")));
        }
        if (dto.getSupplierId() != null) {
            product.setSupplier(supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new NotFoundException("Supplier not found")));
        }
    }
}

