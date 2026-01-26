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
    public ResponseEntity<Cart> addToCart(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddToCartRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Cart cart = getOrCreateCart(user);

        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu Item not found"));

        // Check restaurant conflict
        if (cart.getRestaurant() != null && !cart.getRestaurant().getId().equals(menuItem.getRestaurant().getId())) {
            // Logic to either reject or clear. For now, let's auto-clear slightly
            // aggressive but simple.
            // Or return 409 Conflict? Let's auto-clear for simplicity in this MVP phase or
            // User confirms in frontend.
            // Actually, implementation plan said "Logic to warn user".
            // Frontend can check this. But here, if they force add, we might clear.
            // For now: Auto-replace.
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

        return ResponseEntity.ok(cartRepository.save(cart));
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
