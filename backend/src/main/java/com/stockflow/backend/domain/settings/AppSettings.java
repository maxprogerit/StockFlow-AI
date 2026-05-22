package com.stockflow.backend.domain.settings;

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
@Table(name = "settings")
public class AppSettings extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    @Column(nullable = false)
    private String currency = "USD";
    @Column(nullable = false)
    private String timezone = "UTC";
    @Column(nullable = false)
    private boolean notificationsEnabled = true;
    @Column(nullable = false)
    private Integer lowStockThresholdDefault = 10;
    @Column(nullable = false)
    private Integer forecastHorizonMonths = 6;
    @Column(nullable = false)
    private String theme = "dark";
    private String apiKeyHint;
}
