package com.stockflow.backend.domain.catalog;

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
@Table(name = "categories")
public class Category extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;
}

