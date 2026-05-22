package com.stockflow.backend.domain.analytics;

import com.stockflow.backend.common.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.stockflow.backend.domain.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "analytics")
public class AnalyticsRecord extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    private String metricName;
    private BigDecimal metricValue;
    private String period;
    private Instant recordedAt;
}

