package com.quickbite.service;

import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.quickbite.model.OrderStatus;
import com.quickbite.repository.OrderRepository;

@Service
public class OrderTrackingService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderTrackingService.class);
    private static final long STAGE_DURATION_MS = 10000L; // 10 seconds between stages

    private final OrderRepository orderRepository;

    public OrderTrackingService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Async
    public CompletableFuture<Void> simulateOrderProgression(Long orderId) {
        if (orderId == null) {
            logger.error("OrderId cannot be null");
            return CompletableFuture.failedFuture(new IllegalArgumentException("OrderId cannot be null"));
        }

        try {
            // Verify order exists
            var order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
            
            logger.info("Starting order progression simulation for orderId: {}", orderId);

            updateStatus(orderId, OrderStatus.PREPARING);
            sleep(STAGE_DURATION_MS);

            updateStatus(orderId, OrderStatus.OUT_FOR_DELIVERY);
            sleep(STAGE_DURATION_MS);

            updateStatus(orderId, OrderStatus.DELIVERED);
            logger.info("Order progression completed for orderId: {}", orderId);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("Order progression interrupted for orderId: {}", orderId, e);
            return CompletableFuture.failedFuture(e);
        } catch (RuntimeException e) {
            logger.error("Error during order progression for orderId: {}", orderId, e);
            return CompletableFuture.failedFuture(e);
        } catch (Exception e) {
            logger.error("Unexpected error during order progression for orderId: {}", orderId, e);
            return CompletableFuture.failedFuture(e);
        }
        
        return CompletableFuture.completedFuture(null);
    }

    private void updateStatus(Long orderId, OrderStatus status) {
        try {
            orderRepository.findById(orderId).ifPresent(order -> {
                order.setStatus(status);
                orderRepository.save(order);
                logger.debug("Updated order {} status to {}", orderId, status);
            });
        } catch (Exception e) {
            logger.error("Failed to update order status for orderId: {}, status: {}", orderId, status, e);
        }
    }

    private void sleep(long millis) throws InterruptedException {
        Thread.sleep(millis);
    }
}
