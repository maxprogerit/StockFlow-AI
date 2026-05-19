package com.stockflow.backend.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {
    @GetMapping
    public Map<String, Object> settings() {
        return Map.of(
                "companyName", "StockFlow AI",
                "defaultCurrency", "USD",
                "notificationsEnabled", true,
                "roles", new String[]{"ADMIN", "MANAGER", "EMPLOYEE"}
        );
    }
}

