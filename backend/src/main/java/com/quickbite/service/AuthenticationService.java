package com.quickbite.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.quickbite.dto.AuthenticationRequest;
import com.quickbite.dto.AuthenticationResponse;
import com.quickbite.dto.RegisterRequest;
import com.quickbite.model.Role;
import com.quickbite.model.User;
import com.quickbite.repository.UserRepository;
import com.quickbite.security.JwtUtil;
import java.time.Instant;
import java.util.Optional;

@Service
public class AuthenticationService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private static final long REFRESH_TOKEN_EXPIRY_MS = 2592000000L; // 30 days

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final com.quickbite.repository.RefreshTokenRepository refreshTokenRepository;

    public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                    AuthenticationManager authenticationManager,
                    com.quickbite.repository.RefreshTokenRepository refreshTokenRepository) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public com.quickbite.model.RefreshToken createRefreshToken(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        try {
            // Delete any existing refresh tokens for this user
            refreshTokenRepository.deleteByUser(user);

            com.quickbite.model.RefreshToken refreshToken = new com.quickbite.model.RefreshToken();
            refreshToken.setUser(user);
            refreshToken.setExpiryDate(Instant.now().plusMillis(REFRESH_TOKEN_EXPIRY_MS));
            refreshToken.setToken(java.util.UUID.randomUUID().toString());
            
            logger.debug("Created refresh token for user: {}", user.getId());
            return refreshTokenRepository.save(refreshToken);
        } catch (Exception e) {
            logger.error("Error creating refresh token", e);
            throw new RuntimeException("Failed to create refresh token: " + e.getMessage(), e);
        }
    }

    public Optional<com.quickbite.model.RefreshToken> findByToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            logger.warn("Empty or null refresh token provided");
            return Optional.empty();
        }
        return refreshTokenRepository.findByToken(token);
    }

    public com.quickbite.model.RefreshToken verifyExpiration(com.quickbite.model.RefreshToken token) {
        if (token == null) {
            throw new IllegalArgumentException("Refresh token cannot be null");
        }

        if (token.getExpiryDate() == null) {
            throw new RuntimeException("Refresh token has no expiry date");
        }

        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            try {
                refreshTokenRepository.delete(token);
                logger.warn("Refresh token expired: {}", token.getToken());
            } catch (Exception e) {
                logger.error("Error deleting expired token", e);
            }
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Register request cannot be null");
        }

        try {
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new IllegalArgumentException("Email is required");
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Password is required");
            }

            // Check if user exists
            if (repository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("User with this email already exists");
            }

            var role = request.getRole() != null ? request.getRole() : Role.USER;

            User user = new User();
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhoneNumber(request.getPhoneNumber());
            user.setRole(role);

            User savedUser = repository.save(user);
            logger.info("User registered successfully: {}", savedUser.getEmail());
            
            var jwtToken = jwtUtil.generateToken(savedUser);
            var refreshToken = createRefreshToken(savedUser);

            AuthenticationResponse response = new AuthenticationResponse();
            response.setAccessToken(jwtToken);
            response.setRefreshToken(refreshToken.getToken());
            response.setRole(savedUser.getRole() != null ? savedUser.getRole().name() : "USER");

            return response;
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid registration parameters", e);
            throw e;
        } catch (RuntimeException e) {
            logger.error("Error during registration", e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during registration", e);
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Authentication request cannot be null");
        }

        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        try {
            authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                            request.getEmail(),
                                            request.getPassword()));
            
            var user = repository.findByEmail(request.getEmail())
                            .orElseThrow(() -> new RuntimeException("User not found"));
            
            logger.info("User authenticated successfully: {}", user.getEmail());
            
            var jwtToken = jwtUtil.generateToken(user);
            var refreshToken = createRefreshToken(user);

            AuthenticationResponse response = new AuthenticationResponse();
            response.setAccessToken(jwtToken);
            response.setRefreshToken(refreshToken.getToken());
            response.setRole(user.getRole() != null ? user.getRole().name() : "USER");

            return response;
        } catch (Exception e) {
            logger.error("Authentication failed for email: {}", request.getEmail(), e);
            throw new RuntimeException("Authentication failed: Invalid credentials", e);
        }
    }

    public void generateOtp(String email) {
        if (email == null || email.trim().isEmpty()) {
            logger.warn("Empty email for OTP generation");
            return;
        }

        try {
            // In production: Generate Random 4-6 digit code, save to Redis/DB with expiry,
            // send via Email/SMS
            String otp = String.format("%04d", (int) (Math.random() * 10000));
            logger.info("OTP generated for email: {} (value logged for debug only)", email);
            // In production, send via email/SMS
        } catch (Exception e) {
            logger.error("Error generating OTP for email: {}", email, e);
        }
    }

    public boolean verifyOtp(String email, String otp) {
        if (email == null || otp == null) {
            logger.warn("Empty email or OTP for verification");
            return false;
        }

        try {
            // In production: Verify OTP from Redis/DB
            // For now, accept "1234" for testing
            boolean isValid = "1234".equals(otp);
            if (!isValid) {
                logger.warn("Invalid OTP provided for email: {}", email);
            }
            return isValid;
        } catch (Exception e) {
            logger.error("Error verifying OTP for email: {}", email, e);
            return false;
        }
    }

    public AuthenticationResponse refreshToken(String refreshTokenStr) {
        if (refreshTokenStr == null || refreshTokenStr.trim().isEmpty()) {
            throw new IllegalArgumentException("Refresh token cannot be null or empty");
        }

        try {
            return findByToken(refreshTokenStr)
                            .map(this::verifyExpiration)
                            .map(com.quickbite.model.RefreshToken::getUser)
                            .map(user -> {
                                if (user == null) {
                                    throw new RuntimeException("User associated with refresh token not found");
                                }
                                String accessToken = jwtUtil.generateToken(user);
                                logger.info("Refresh token used to generate new access token for user: {}", user.getId());
                                return new AuthenticationResponse(accessToken, refreshTokenStr,
                                                user.getRole() != null ? user.getRole().name() : "USER");
                            })
                            .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
        } catch (RuntimeException e) {
            logger.error("Error refreshing token", e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during token refresh", e);
            throw new RuntimeException("Token refresh failed: " + e.getMessage(), e);
        }
    }
}
