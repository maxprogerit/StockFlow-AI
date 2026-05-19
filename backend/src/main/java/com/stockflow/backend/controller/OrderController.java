package com.stockflow.backend.controller;

import com.stockflow.backend.domain.order.CustomerOrder;
import com.stockflow.backend.domain.order.PurchaseOrder;
import com.stockflow.backend.repository.CustomerOrderRepository;
import com.stockflow.backend.repository.PurchaseOrderRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CustomerOrderRepository customerOrderRepository;

    @GetMapping("/purchase")
    public List<PurchaseOrder> purchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    @PostMapping("/purchase")
    public PurchaseOrder createPurchaseOrder(@RequestBody PurchaseOrder order) {
        return purchaseOrderRepository.save(order);
    }

    @GetMapping("/customer")
    public List<CustomerOrder> customerOrders() {
        return customerOrderRepository.findAll();
    }

    @PostMapping("/customer")
    public CustomerOrder createCustomerOrder(@RequestBody CustomerOrder order) {
        return customerOrderRepository.save(order);
    }
}

