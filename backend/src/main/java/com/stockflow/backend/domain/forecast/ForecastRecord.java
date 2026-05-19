package com.stockflow.backend.domain.forecast;

import com.stockflow.backend.common.BaseEntity;
import com.stockflow.backend.domain.product.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "forecasts")
public class ForecastRecord extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    private BigDecimal predictedDemand;
    private BigDecimal recommendedRestock;
    private Double confidence;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private String insight;
}

