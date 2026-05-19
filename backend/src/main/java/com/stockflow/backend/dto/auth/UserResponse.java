package com.stockflow.backend.dto.auth;

import com.stockflow.backend.domain.user.Role;
import java.util.UUID;

public record UserResponse(UUID id, String fullName, String email, Role role) {
}

