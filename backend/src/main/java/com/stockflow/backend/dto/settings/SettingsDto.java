package com.stockflow.backend.dto.settings;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SettingsDto {
    private String companyName;
    private String companyWebsite;
    private String companyAddress;
    private String currency;
    private String timezone;
    private boolean notificationsEnabled;
    private Integer lowStockThresholdDefault;
    private Integer forecastHorizonMonths;
    private String theme;
    private String apiKeyHint;
}
