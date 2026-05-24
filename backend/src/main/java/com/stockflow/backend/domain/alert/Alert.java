package com.stockflow.backend.domain.alert;

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
@Table(name = "alerts")
public class Alert extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    @Column(nullable = false)
    private String type;
    @Column(nullable = false)
    private String severity;
    @Column(nullable = false)
    private String message;
    @Column(nullable = false)
    private boolean resolved = false;
    private String metadata;
    @Column(name = "is_read")
    private boolean read = false;
}

