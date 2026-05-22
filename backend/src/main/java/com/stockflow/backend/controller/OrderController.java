package com.stockflow.backend.controller;

import com.stockflow.backend.dto.order.OrderCreateRequest;
import com.stockflow.backend.dto.order.OrderDto;
import com.stockflow.backend.service.OrderService;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> orders(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return orderService.list(type, status, q, page, size);
    }

    @PostMapping
    public OrderDto create(@RequestBody OrderCreateRequest order) {
        return orderService.create(order);
    }

    @PatchMapping("/{type}/{id}/status")
    public OrderDto updateStatus(@PathVariable String type, @PathVariable UUID id, @RequestBody Map<String, String> payload) {
        return orderService.updateStatus(type, id, payload.getOrDefault("status", "CREATED"));
    }
}

