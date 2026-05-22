package com.stockflow.backend.controller;

import com.stockflow.backend.dto.product.ProductDto;
import com.stockflow.backend.service.ProductService;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public Page<ProductDto> list(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.findAll(q, pageable);
    }

    @GetMapping("/{id}")
    public ProductDto get(@PathVariable UUID id) {
        return productService.findOne(id);
    }

    @PostMapping
    public ProductDto create(@RequestBody ProductDto dto) {
        return productService.create(dto);
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable UUID id, @RequestBody ProductDto dto) {
        return productService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        productService.delete(id);
    }

    @GetMapping("/{id}/analytics")
    public Map<String, Object> analytics(@PathVariable UUID id) {
        return productService.analytics(id);
    }
}

