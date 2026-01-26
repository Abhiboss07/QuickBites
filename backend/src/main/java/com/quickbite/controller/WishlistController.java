package com.quickbite.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickbite.model.Restaurant;
import com.quickbite.model.User;
import com.quickbite.model.Wishlist;
import com.quickbite.repository.RestaurantRepository;
import com.quickbite.repository.UserRepository;
import com.quickbite.repository.WishlistRepository;

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
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(wishlistRepository.findAllByUser(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/toggle/{restaurantId}")
    public ResponseEntity<?> toggleWishlist(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long restaurantId) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found"));

            Optional<Wishlist> existing = wishlistRepository.findByUserAndRestaurant(user, restaurant);
            if (existing.isPresent()) {
                wishlistRepository.delete(existing.get());
                return ResponseEntity.ok().body("{\"status\": \"removed\"}");
            } else {
                wishlistRepository.save(new Wishlist(user, restaurant));
                return ResponseEntity.ok().body("{\"status\": \"added\"}");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
