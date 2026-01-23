package com.quickbite.service;

import com.quickbite.config.ApplicationConfig;
import com.quickbite.dto.AuthenticationRequest;
import com.quickbite.dto.AuthenticationResponse;
import com.quickbite.dto.RegisterRequest;
import com.quickbite.model.Role;
import com.quickbite.model.User;
import com.quickbite.repository.UserRepository;
import com.quickbite.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;

        public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                        AuthenticationManager authenticationManager) {
                this.repository = repository;
                this.passwordEncoder = passwordEncoder;
                this.jwtUtil = jwtUtil;
                this.authenticationManager = authenticationManager;
        }

        public AuthenticationResponse register(RegisterRequest request) {
                var role = request.getRole() != null ? request.getRole() : Role.USER;

                User user = new User();
                user.setFullName(request.getFullName());
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setPhoneNumber(request.getPhoneNumber());
                user.setRole(role);

                repository.save(user);
                var jwtToken = jwtUtil.generateToken(user);

                AuthenticationResponse response = new AuthenticationResponse();
                response.setToken(jwtToken);
                response.setRole(user.getRole().name());

                return response;
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtUtil.generateToken(user);

                AuthenticationResponse response = new AuthenticationResponse();
                response.setToken(jwtToken);
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
}
