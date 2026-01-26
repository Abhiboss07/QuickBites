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

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrderRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(orderService.placeOrder(user, request.getAddressId())); // Address can be null for now
                                                                                         // if pickup? Or enforce.
                                                                                         // Service handles null.
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }
}
