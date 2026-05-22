package com.stockflow.backend.service;

import com.stockflow.backend.domain.supplier.Supplier;
import com.stockflow.backend.dto.supplier.SupplierDto;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.ProductRepository;
import com.stockflow.backend.repository.PurchaseOrderRepository;
import com.stockflow.backend.repository.SupplierRepository;
import com.stockflow.backend.security.CurrentUserService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    public List<SupplierDto> list() {
        UUID ownerId = currentUserService.currentUserId();
        return supplierRepository.findByOwnerIdOrderByNameAsc(ownerId).stream().map(this::toDto).toList();
    }

    @Transactional
    public SupplierDto create(Supplier supplier) {
        var owner = currentUserService.currentUser();
        supplier.setOwner(owner);
        Supplier saved = supplierRepository.save(supplier);
        activityLogService.log(owner, "SUPPLIERS", "CREATE_SUPPLIER", saved.getName());
        return toDto(saved);
    }

    @Transactional
    public SupplierDto update(UUID id, Supplier payload) {
        var owner = currentUserService.currentUser();
        Supplier supplier = supplierRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Supplier not found"));
        supplier.setName(payload.getName());
        supplier.setContactEmail(payload.getContactEmail());
        supplier.setContactPhone(payload.getContactPhone());
        supplier.setAddress(payload.getAddress());
        supplier.setRating(payload.getRating());
        supplier.setActive(payload.isActive());
        Supplier saved = supplierRepository.save(supplier);
        activityLogService.log(owner, "SUPPLIERS", "UPDATE_SUPPLIER", saved.getName());
        return toDto(saved);
    }

    @Transactional
    public void delete(UUID id) {
        var owner = currentUserService.currentUser();
        Supplier supplier = supplierRepository.findById(id)
                .filter(item -> item.getOwner().getId().equals(owner.getId()))
                .orElseThrow(() -> new NotFoundException("Supplier not found"));
        supplierRepository.delete(supplier);
        activityLogService.log(owner, "SUPPLIERS", "DELETE_SUPPLIER", supplier.getName());
    }

    private SupplierDto toDto(Supplier supplier) {
        SupplierDto dto = new SupplierDto();
        dto.setId(supplier.getId());
        dto.setName(supplier.getName());
        dto.setContactEmail(supplier.getContactEmail());
        dto.setContactPhone(supplier.getContactPhone());
        dto.setAddress(supplier.getAddress());
        dto.setRating(supplier.getRating());
        dto.setActive(supplier.isActive());
        UUID ownerId = supplier.getOwner().getId();
        dto.setProductsCount((int) productRepository.findForOwner(ownerId, null, org.springframework.data.domain.PageRequest.of(0, 1_000)).stream()
                .filter(product -> product.getSupplier() != null && product.getSupplier().getId().equals(supplier.getId()))
                .count());
        dto.setPurchaseOrdersCount((int) purchaseOrderRepository.findTop10ByOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .filter(order -> order.getSupplier() != null && order.getSupplier().getId().equals(supplier.getId()))
                .count());
        return dto;
    }
}
