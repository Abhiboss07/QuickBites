package com.quickbite.controller;

import com.quickbite.model.MenuItem;
import com.quickbite.model.Restaurant;
import com.quickbite.model.User;
import com.quickbite.repository.RestaurantRepository;
import com.quickbite.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public RestaurantController(RestaurantRepository restaurantRepository, UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        return restaurantRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Restaurant restaurant) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        restaurant.setOwner(user);
        return ResponseEntity.ok(restaurantRepository.save(restaurant));
    }

    @PostMapping("/{id}/menu")
    public ResponseEntity<Restaurant> addMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    menuItem.setRestaurant(restaurant);
                    if (restaurant.getMenuItems() == null) {
                        restaurant.setMenuItems(new java.util.ArrayList<>());
                    }
                    restaurant.getMenuItems().add(menuItem);
                    return ResponseEntity.ok(restaurantRepository.save(restaurant));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
