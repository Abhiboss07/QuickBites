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
        return ResponseEntity.ok(userRepository.findByEmail(userDetails.getUsername()).orElseThrow());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User userUpdate) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        if (userUpdate.getFullName() != null)
            user.setFullName(userUpdate.getFullName());
        if (userUpdate.getPhoneNumber() != null)
            user.setPhoneNumber(userUpdate.getPhoneNumber());
        // Email update usually requires re-verification, skipping for now

        return ResponseEntity.ok(userRepository.save(user));
    }
}
