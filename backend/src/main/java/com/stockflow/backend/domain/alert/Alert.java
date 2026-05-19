package com.stockflow.backend.domain.alert;

import com.stockflow.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "alerts")
public class Alert extends BaseEntity {
    @Column(nullable = false)
    private String type;
    @Column(nullable = false)
    private String severity;
    @Column(nullable = false)
    private String message;
    @Column(nullable = false)
    private boolean resolved = false;
    private String metadata;
}

