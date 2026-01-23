package com.quickbite.controller;

import com.quickbite.dto.OrderRequest;
import com.quickbite.model.OrderEntity;
import com.quickbite.model.OrderStatus;
import com.quickbite.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<OrderEntity> placeOrder(@RequestBody OrderRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(service.placeOrder(email, request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderEntity>> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(service.getUserOrders(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderEntity> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getOrderById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderEntity> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        // In real app, check if user is restaurant owner or admin
        return ResponseEntity.ok(service.updateOrderStatus(id, status));
    }
}
