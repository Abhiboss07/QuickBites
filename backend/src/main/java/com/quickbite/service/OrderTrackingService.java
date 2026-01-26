package com.quickbite.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.quickbite.model.OrderStatus;
import com.quickbite.repository.OrderRepository;

@Service
public class OrderTrackingService {

    private final OrderRepository orderRepository;

    public OrderTrackingService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Async
    public CompletableFuture<Void> simulateOrderProgression(Long orderId) {
        System.out.println("Starting simulation for Order " + orderId);
        try {
            updateStatus(orderId, OrderStatus.PREPARING);
            Thread.sleep(10000); // 10s

            updateStatus(orderId, OrderStatus.OUT_FOR_DELIVERY);
            Thread.sleep(10000); // 10s

            updateStatus(orderId, OrderStatus.DELIVERED);
            System.out.println("Order " + orderId + " Delivered.");

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture(null);
    }

    private void updateStatus(Long orderId, OrderStatus status) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setStatus(status);
            orderRepository.save(order);
            System.out.println("Order " + orderId + " updated to " + status);
        });
    }
}
