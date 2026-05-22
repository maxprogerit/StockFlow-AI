package com.stockflow.backend.dto.profile;

import com.stockflow.backend.domain.user.Role;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileDto {
    private UUID id;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String timezone;
    private String jobTitle;
    private Role role;
    private Integer profileCompletion;
    private List<Map<String, Object>> recentActions;
}
