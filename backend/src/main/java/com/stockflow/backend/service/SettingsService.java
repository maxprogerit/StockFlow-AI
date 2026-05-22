package com.stockflow.backend.service;

import com.stockflow.backend.domain.company.Company;
import com.stockflow.backend.domain.settings.AppSettings;
import com.stockflow.backend.dto.settings.SettingsDto;
import com.stockflow.backend.repository.AppSettingsRepository;
import com.stockflow.backend.repository.CompanyRepository;
import com.stockflow.backend.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {
    private final AppSettingsRepository appSettingsRepository;
    private final CompanyRepository companyRepository;
    private final CurrentUserService currentUserService;
    private final ActivityLogService activityLogService;

    @Transactional
    public SettingsDto get() {
        var owner = currentUserService.currentUser();
        Company company = companyRepository.findByOwnerId(owner.getId()).orElseGet(() -> {
            Company item = new Company();
            item.setOwner(owner);
            item.setName("My Company");
            return companyRepository.save(item);
        });
        AppSettings settings = appSettingsRepository.findByOwnerId(owner.getId()).orElseGet(() -> {
            AppSettings item = new AppSettings();
            item.setOwner(owner);
            return appSettingsRepository.save(item);
        });
        return toDto(company, settings);
    }

    @Transactional
    public SettingsDto update(SettingsDto payload) {
        var owner = currentUserService.currentUser();
        Company company = companyRepository.findByOwnerId(owner.getId()).orElseGet(() -> {
            Company item = new Company();
            item.setOwner(owner);
            item.setName("My Company");
            return item;
        });
        company.setName(payload.getCompanyName() == null || payload.getCompanyName().isBlank() ? company.getName() : payload.getCompanyName());
        company.setWebsite(payload.getCompanyWebsite());
        company.setAddress(payload.getCompanyAddress());
        company = companyRepository.save(company);

        AppSettings settings = appSettingsRepository.findByOwnerId(owner.getId()).orElseGet(() -> {
            AppSettings item = new AppSettings();
            item.setOwner(owner);
            return item;
        });
        settings.setCurrency(payload.getCurrency() == null || payload.getCurrency().isBlank() ? settings.getCurrency() : payload.getCurrency());
        settings.setTimezone(payload.getTimezone() == null || payload.getTimezone().isBlank() ? settings.getTimezone() : payload.getTimezone());
        settings.setNotificationsEnabled(payload.isNotificationsEnabled());
        settings.setLowStockThresholdDefault(payload.getLowStockThresholdDefault() == null ? settings.getLowStockThresholdDefault() : payload.getLowStockThresholdDefault());
        settings.setForecastHorizonMonths(payload.getForecastHorizonMonths() == null ? settings.getForecastHorizonMonths() : payload.getForecastHorizonMonths());
        settings.setTheme(payload.getTheme() == null || payload.getTheme().isBlank() ? settings.getTheme() : payload.getTheme());
        settings.setApiKeyHint(payload.getApiKeyHint());
        settings = appSettingsRepository.save(settings);

        activityLogService.log(owner, "SETTINGS", "UPDATE_SETTINGS", payload.getCompanyName());
        return toDto(company, settings);
    }

    private SettingsDto toDto(Company company, AppSettings settings) {
        SettingsDto dto = new SettingsDto();
        dto.setCompanyName(company.getName());
        dto.setCompanyWebsite(company.getWebsite());
        dto.setCompanyAddress(company.getAddress());
        dto.setCurrency(settings.getCurrency());
        dto.setTimezone(settings.getTimezone());
        dto.setNotificationsEnabled(settings.isNotificationsEnabled());
        dto.setLowStockThresholdDefault(settings.getLowStockThresholdDefault());
        dto.setForecastHorizonMonths(settings.getForecastHorizonMonths());
        dto.setTheme(settings.getTheme());
        dto.setApiKeyHint(settings.getApiKeyHint());
        return dto;
    }
}
