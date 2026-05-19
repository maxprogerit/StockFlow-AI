package com.stockflow.backend.domain.report;

import com.stockflow.backend.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "reports")
public class Report extends BaseEntity {
    private String name;
    private String type;
    private String status;
    private String fileUrl;
    private Instant generatedAt;
}

