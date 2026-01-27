package com.quickbite.service;

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

@Service
public class AuthenticationService {

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
                // Delete any existing refresh tokens for this user
                refreshTokenRepository.deleteByUser(user);

                com.quickbite.model.RefreshToken refreshToken = new com.quickbite.model.RefreshToken();
                refreshToken.setUser(user);
                refreshToken.setExpiryDate(java.time.Instant.now().plusMillis(2592000000L)); // 30 days
                refreshToken.setToken(java.util.UUID.randomUUID().toString());
                return refreshTokenRepository.save(refreshToken);
        }

        public java.util.Optional<com.quickbite.model.RefreshToken> findByToken(String token) {
                return refreshTokenRepository.findByToken(token);
        }

        public com.quickbite.model.RefreshToken verifyExpiration(com.quickbite.model.RefreshToken token) {
                if (token.getExpiryDate().compareTo(java.time.Instant.now()) < 0) {
                        refreshTokenRepository.delete(token);
                        throw new RuntimeException(token.getToken()
                                        + " Refresh token was expired. Please make a new signin request");
                }
                return token;
        }

        public AuthenticationResponse register(RegisterRequest request) {
                try {
                        var role = request.getRole() != null ? request.getRole() : Role.USER;

                        User user = new User();
                        user.setFullName(request.getFullName());
                        user.setEmail(request.getEmail());
                        user.setPassword(passwordEncoder.encode(request.getPassword()));
                        user.setPhoneNumber(request.getPhoneNumber());
                        user.setRole(role);

                        User savedUser = repository.save(user);
                        var jwtToken = jwtUtil.generateToken(savedUser);
                        var refreshToken = createRefreshToken(savedUser);

                        AuthenticationResponse response = new AuthenticationResponse();
                        response.setAccessToken(jwtToken);
                        response.setRefreshToken(refreshToken.getToken());
                        response.setRole(savedUser.getRole() != null ? savedUser.getRole().name() : "USER");

                        return response;
                } catch (Exception e) {
                        throw new RuntimeException("Registration failed: " + e.getMessage(), e);
                }
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                var jwtToken = jwtUtil.generateToken(user);
                var refreshToken = createRefreshToken(user);

                AuthenticationResponse response = new AuthenticationResponse();
                response.setAccessToken(jwtToken);
                response.setRefreshToken(refreshToken.getToken());
                response.setRole(user.getRole().name());

                return response;
        }

        public void generateOtp(String email) {
                // In production: Generate Random 4-6 digit code, save to Redis/DB with expiry,
                // send via Email/SMS
                // Stub: Just log it
                System.out.println("OTP for " + email + ": 1234");
        }

        public boolean verifyOtp(String email, String otp) {
                // Stub: Always accept "1234"
                return "1234".equals(otp);
        }

        public AuthenticationResponse refreshToken(String refreshToken) {
                return findByToken(refreshToken)
                                .map(this::verifyExpiration)
                                .map(com.quickbite.model.RefreshToken::getUser)
                                .map(user -> {
                                        String accessToken = jwtUtil.generateToken(user);
                                        return new AuthenticationResponse(accessToken, refreshToken,
                                                        user.getRole().name());
                                })
                                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
        }
}
