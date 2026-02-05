package com.quickbite.controller;

import com.quickbite.dto.OrderRequest;
import com.quickbite.model.Order;
import com.quickbite.model.User;
import com.quickbite.repository.UserRepository;
import com.quickbite.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final com.quickbite.service.OrderTrackingService trackingService;

    public OrderController(OrderService orderService, UserRepository userRepository,
            com.quickbite.service.OrderTrackingService trackingService) {
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.trackingService = trackingService;
    }

    @PostMapping("/{id}/track")
    public ResponseEntity<?> startTracking(@PathVariable Long id) {
        if (id == null || id <= 0) {
            logger.warn("Invalid orderId for tracking: {}", id);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid order ID");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            logger.info("Received track request for Order {}", id);
            trackingService.simulateOrderProgression(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Simulation started for Order " + id);
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error starting tracking for order {}", id, e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to start tracking: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrderRequest request) {
        if (userDetails == null) {
            logger.warn("Unauthorized order placement attempt");
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not authenticated");
            return ResponseEntity.status(401).body(error);
        }

        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (request == null || request.getAddressId() == null) {
                logger.warn("Invalid order request for user {}", user.getId());
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid order request: missing required fields");
                return ResponseEntity.badRequest().body(error);
            }
            
            Order order = orderService.placeOrder(user, request.getAddressId());
            logger.info("Order created successfully with id: {} for user: {}", order.getId(), user.getId());
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid order parameters", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid parameters: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            logger.error("Runtime error during order creation", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Order creation failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        } catch (Exception e) {
            logger.error("Unexpected error during order creation", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthorized order fetch attempt");
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not authenticated");
            return ResponseEntity.status(401).body(error);
        }

        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Order> orders = orderService.getUserOrders(user);
            logger.info("Retrieved {} orders for user: {}", orders.size(), user.getId());
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            logger.error("Error fetching orders", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch orders: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
