package com.stockflow.backend.domain.warehouse;

import com.stockflow.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "warehouses")
public class Warehouse extends BaseEntity {
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String location;
    private Integer capacity;
    private boolean active = true;
}

