package com.stockflow.backend.security;

import com.stockflow.backend.domain.user.User;
import com.stockflow.backend.exception.NotFoundException;
import com.stockflow.backend.repository.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {
    private final UserRepository userRepository;

    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new NotFoundException("Authenticated user not found");
        }
        return userRepository.findByEmail(authentication.getName().toLowerCase())
                .orElseThrow(() -> new NotFoundException("Authenticated user not found"));
    }

    public UUID currentUserId() {
        return currentUser().getId();
    }
}
