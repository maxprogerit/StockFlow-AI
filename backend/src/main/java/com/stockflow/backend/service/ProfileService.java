package com.stockflow.backend.service;

import com.stockflow.backend.dto.profile.ProfileDto;
import com.stockflow.backend.repository.ActivityLogRepository;
import com.stockflow.backend.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final CurrentUserService currentUserService;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    public ProfileDto getProfile() {
        var user = currentUserService.currentUser();
        ProfileDto dto = new ProfileDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setTimezone(user.getTimezone());
        dto.setJobTitle(user.getJobTitle());
        dto.setRole(user.getRole());
        int completion = 0;
        completion += user.getFullName() != null && !user.getFullName().isBlank() ? 20 : 0;
        completion += user.getAvatarUrl() != null && !user.getAvatarUrl().isBlank() ? 20 : 0;
        completion += user.getTimezone() != null && !user.getTimezone().isBlank() ? 20 : 0;
        completion += user.getJobTitle() != null && !user.getJobTitle().isBlank() ? 20 : 0;
        completion += user.getEmail() != null && !user.getEmail().isBlank() ? 20 : 0;
        dto.setProfileCompletion(completion);
        dto.setRecentActions(activityLogRepository.findTop20ByOwnerIdOrderByCreatedAtDesc(user.getId()).stream()
                .limit(8)
                .map(item -> java.util.Map.<String, Object>of(
                        "action", item.getAction(),
                        "module", item.getModule(),
                        "metadata", item.getMetadata() == null ? "" : item.getMetadata(),
                        "createdAt", item.getCreatedAt()
                ))
                .toList());
        return dto;
    }

    @Transactional
    public ProfileDto updateProfile(ProfileDto payload) {
        var user = currentUserService.currentUser();
        user.setFullName(payload.getFullName());
        user.setAvatarUrl(payload.getAvatarUrl());
        user.setTimezone(payload.getTimezone());
        user.setJobTitle(payload.getJobTitle());
        activityLogService.log(user, "PROFILE", "UPDATE_PROFILE", payload.getFullName());
        return getProfile();
    }

    @Transactional
    public void updatePassword(String newPassword) {
        var user = currentUserService.currentUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        activityLogService.log(user, "PROFILE", "CHANGE_PASSWORD", "Password updated");
    }
}
