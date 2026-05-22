package com.stockflow.backend.controller;

import com.stockflow.backend.dto.profile.ProfileDto;
import com.stockflow.backend.service.ProfileService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ProfileDto profile() {
        return profileService.getProfile();
    }

    @PatchMapping
    public ProfileDto update(@RequestBody ProfileDto payload) {
        return profileService.updateProfile(payload);
    }

    @PatchMapping("/password")
    public void password(@RequestBody Map<String, String> payload) {
        String value = payload.getOrDefault("password", "");
        if (value.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        profileService.updatePassword(value);
    }
}
