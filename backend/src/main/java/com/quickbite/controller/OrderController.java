package com.quickbite.controller;

import com.quickbite.dto.OrderRequest;
import com.quickbite.model.Order;
import com.quickbite.model.User;
import com.quickbite.repository.UserRepository;
import com.quickbite.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

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
    public ResponseEntity<String> startTracking(@PathVariable Long id) {
        try {
            System.out.println("Received track request for Order " + id);
            trackingService.simulateOrderProgression(id);
            return ResponseEntity.ok("Simulation started for Order " + id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrderRequest request) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            return ResponseEntity.ok(orderService.placeOrder(user, request.getAddressId()));
        } catch (Exception e) {
            try {
                java.io.FileWriter fw = new java.io.FileWriter("error_order.log", true);
                e.printStackTrace(new java.io.PrintWriter(fw));
                fw.close();
            } catch (Exception ex) {
            }
            return ResponseEntity.status(500).body("CreateOrder Failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }
}
