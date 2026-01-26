package com.quickbite.controller;

import com.quickbite.dto.AuthenticationRequest;
import com.quickbite.dto.AuthenticationResponse;
import com.quickbite.dto.RefreshTokenRequest;
import com.quickbite.dto.RegisterRequest;
import com.quickbite.service.AuthenticationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest request) {
        boolean isValid = service.verifyOtp(request.getEmail(), request.getOtp());
        if (isValid) {
            return ResponseEntity.ok("OTP Verified");
        } else {
            return ResponseEntity.status(401).body("Invalid OTP");
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@org.springframework.web.bind.annotation.RequestParam String email) {
        service.generateOtp(email);
        return ResponseEntity.ok("OTP Sent");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(service.refreshToken(request.getToken()));
    }

    static class OtpRequest {
        private String email;
        private String otp;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
}
