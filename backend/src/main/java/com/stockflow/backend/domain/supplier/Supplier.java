package com.stockflow.backend.domain.supplier;

import com.stockflow.backend.common.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.stockflow.backend.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "suppliers")
public class Supplier extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    @Column(nullable = false)
    private String name;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private Double rating;
    private boolean active = true;
}

