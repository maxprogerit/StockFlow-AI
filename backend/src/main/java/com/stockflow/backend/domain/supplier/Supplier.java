package com.stockflow.backend.domain.supplier;

import com.stockflow.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "suppliers")
public class Supplier extends BaseEntity {
    @Column(nullable = false)
    private String name;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private Double rating;
}

