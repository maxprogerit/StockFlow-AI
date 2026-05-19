package com.stockflow.backend.domain.analytics;

import com.stockflow.backend.common.BaseEntity;
import jakarta.persistence.Entity;
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
    private String metricName;
    private BigDecimal metricValue;
    private String period;
    private Instant recordedAt;
}

