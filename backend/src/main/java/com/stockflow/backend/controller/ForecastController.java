package com.stockflow.backend.controller;

import com.stockflow.backend.service.ForecastService;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/forecasting")
@RequiredArgsConstructor
public class ForecastController {
    private final ForecastService forecastService;

    @PostMapping("/{productId}")
    public Map<String, Object> generate(@PathVariable UUID productId, @RequestParam(defaultValue = "6") int months) {
        return forecastService.forecast(productId, months);
    }

    @GetMapping("/{productId}/history")
    public Object history(@PathVariable UUID productId) {
        return forecastService.history(productId);
    }
}

