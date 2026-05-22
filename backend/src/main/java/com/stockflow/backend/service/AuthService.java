package com.stockflow.backend.service;

import com.stockflow.backend.domain.auth.RefreshToken;
import com.stockflow.backend.domain.user.Role;
import com.stockflow.backend.domain.user.User;
import com.stockflow.backend.dto.auth.AuthRequest;
import com.stockflow.backend.dto.auth.AuthResponse;
import com.stockflow.backend.dto.auth.RefreshTokenRequest;
import com.stockflow.backend.dto.auth.RegisterRequest;
import com.stockflow.backend.dto.auth.UserResponse;
import com.stockflow.backend.repository.RefreshTokenRepository;
import com.stockflow.backend.repository.UserRepository;
import com.stockflow.backend.security.JwtService;
import java.time.Instant;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.MANAGER);
        User saved = userRepository.save(user);
        return issueTokens(saved);
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        String email = request.email().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Refresh token expired");
        }
        return issueTokens(refreshToken.getUser());
    }

    private AuthResponse issueTokens(User user) {
        String access = jwtService.generateAccessToken(
                user.getEmail(),
                Map.of("role", user.getRole().name(), "uid", user.getId().toString())
        );
        String refresh = jwtService.generateRefreshToken(user.getEmail());
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(refresh);
        token.setExpiresAt(jwtService.extractExpiration(refresh));
        refreshTokenRepository.save(token);
        return new AuthResponse(
                access,
                refresh,
                "Bearer",
                new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole())
        );
    }
}

