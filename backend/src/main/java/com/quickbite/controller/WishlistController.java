package com.quickbite.controller;

import com.quickbite.model.*;
import com.quickbite.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public WishlistController(WishlistRepository wishlistRepository, UserRepository userRepository,
            RestaurantRepository restaurantRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping
    public ResponseEntity<List<Wishlist>> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(wishlistRepository.findAllByUser(user));
    }

    @PostMapping("/toggle/{restaurantId}")
    public ResponseEntity<?> toggleWishlist(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long restaurantId) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow();

        Optional<Wishlist> existing = wishlistRepository.findByUserAndRestaurant(user, restaurant);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return ResponseEntity.ok().body("{\"status\": \"removed\"}");
        } else {
            wishlistRepository.save(new Wishlist(user, restaurant));
            return ResponseEntity.ok().body("{\"status\": \"added\"}");
        }
    }
}
