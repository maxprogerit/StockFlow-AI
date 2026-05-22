package com.stockflow.backend.controller;

import com.stockflow.backend.dto.settings.SettingsDto;
import com.stockflow.backend.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {
    private final SettingsService settingsService;

    @GetMapping
    public SettingsDto settings() {
        return settingsService.get();
    }

    @PutMapping
    public SettingsDto update(@RequestBody SettingsDto payload) {
        return settingsService.update(payload);
    }
}

