package com.quickbite.controller;

import com.quickbite.model.User;
import com.quickbite.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found")));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User userUpdate) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (userUpdate.getFullName() != null)
                user.setFullName(userUpdate.getFullName());
            if (userUpdate.getPhoneNumber() != null)
                user.setPhoneNumber(userUpdate.getPhoneNumber());

            return ResponseEntity.ok(userRepository.save(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
