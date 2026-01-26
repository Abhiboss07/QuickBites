package com.quickbite.controller;

import com.quickbite.dto.AddToCartRequest;
import com.quickbite.model.*;
import com.quickbite.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository; // Ensure this is imported if used, but strictly might not
                                                             // need if via MenuItem

    public CartController(CartRepository cartRepository, UserRepository userRepository,
            MenuItemRepository menuItemRepository, RestaurantRepository restaurantRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(getOrCreateCart(user));
    }

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<?> addToCart(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddToCartRequest request) {
        try {
            // Log entry
            try {
                java.io.FileWriter fw = new java.io.FileWriter("debug_entry.log", true);
                fw.write("Entered addToCart\n");
                fw.close();
            } catch (Exception e) {
            }

            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            Cart cart = getOrCreateCart(user);

            MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu Item not found"));

            // Check restaurant conflict
            if (cart.getRestaurant() != null
                    && !cart.getRestaurant().getId().equals(menuItem.getRestaurant().getId())) {
                cart.clear();
                cart.setRestaurant(menuItem.getRestaurant());
            }

            if (cart.getRestaurant() == null) {
                cart.setRestaurant(menuItem.getRestaurant());
            }

            Optional<CartItem> existingItem = cart.getItems().stream()
                    .filter(i -> i.getMenuItem().getId().equals(menuItem.getId()))
                    .findFirst();

            if (existingItem.isPresent()) {
                existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
            } else {
                CartItem newItem = new CartItem(cart, menuItem, request.getQuantity());
                cart.addItem(newItem);
            }

            cartRepository.save(cart);
            return ResponseEntity.ok("Success");
        } catch (Throwable e) {
            try {
                java.io.FileWriter fw = new java.io.FileWriter("error_throwable.log", true);
                e.printStackTrace(new java.io.PrintWriter(fw));
                fw.close();
            } catch (Exception ex) {
            }
            return ResponseEntity.status(500).body("AddToCart Failed Throwable");
        }
    }

    @DeleteMapping("/items/{itemId}")
    @Transactional
    public ResponseEntity<Cart> removeItem(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Cart cart = getOrCreateCart(user);

        // Using iterator or basic removal
        cart.getItems().removeIf(item -> item.getMenuItem().getId().equals(itemId));
        cart.recalculateTotal();

        if (cart.getItems().isEmpty()) {
            cart.setRestaurant(null);
        }

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<Cart> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Cart cart = getOrCreateCart(user);
        cart.clear();
        cart.setRestaurant(null);
        return ResponseEntity.ok(cartRepository.save(cart));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }
}
