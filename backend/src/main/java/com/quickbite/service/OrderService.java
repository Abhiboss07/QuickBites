package com.quickbite.service;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quickbite.model.Address;
import com.quickbite.model.Cart;
import com.quickbite.model.CartItem;
import com.quickbite.model.Order;
import com.quickbite.model.OrderItem;
import com.quickbite.model.OrderStatus;
import com.quickbite.model.User;
import com.quickbite.repository.AddressRepository;
import com.quickbite.repository.CartRepository;
import com.quickbite.repository.OrderRepository;

@Service
public class OrderService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    private static final long MIN_ORDER_AMOUNT = 0L;
    private static final long MAX_ORDER_AMOUNT = 9999999999L; // Max safe long in paise
    private static final long PAYMENT_TIMEOUT_MS = 500L;

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository,
            AddressRepository addressRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional
    public Order placeOrder(User user, Long addressId) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        try {
            Cart cart = cartRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Cart not found for user: " + user.getId()));

            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            Address address = null;
            if (addressId != null) {
                address = addressRepository.findById(addressId)
                        .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));
            }

            // Validate total price
            Double totalPrice = cart.getTotalPrice();
            if (totalPrice == null) {
                throw new RuntimeException("Cart total price is null");
            }
            
            validateOrderAmount(totalPrice);

            // Create Order
            Order order = new Order(user, cart.getRestaurant(), totalPrice, address);

            // Convert CartItems to OrderItems (snapshot)
            for (CartItem ci : cart.getItems()) {
                if (ci == null || ci.getMenuItem() == null) {
                    logger.warn("Null cart item found, skipping");
                    continue;
                }
                
                OrderItem oi = new OrderItem(
                        order,
                        ci.getMenuItem().getId(),
                        ci.getMenuItem().getName(),
                        ci.getPrice(),
                        ci.getQuantity(),
                        ci.getMenuItem().getIsVeg());
                order.addItem(oi);
            }

            // Mock Payment Processing
            if (processPaymentMock(totalPrice)) {
                order.setStatus(OrderStatus.PAID);
                logger.info("Payment successful for order total: {}", totalPrice);
            } else {
                order.setStatus(OrderStatus.PENDING);
                logger.warn("Payment failed for order total: {}", totalPrice);
            }

            Order savedOrder = orderRepository.save(order);
            logger.info("Order placed successfully with id: {}", savedOrder.getId());

            // Clear Cart
            cart.clear();
            cart.setRestaurant(null);
            cartRepository.save(cart);

            return savedOrder;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid order data", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error placing order for user: {}", user.getId(), e);
            throw new RuntimeException("Failed to place order: " + e.getMessage(), e);
        }
    }

    public List<Order> getUserOrders(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    private boolean processPaymentMock(Double amount) {
        try {
            // Validate amount before processing
            if (amount == null || amount <= 0) {
                logger.warn("Invalid payment amount: {}", amount);
                return false;
            }
            
            // Simulate processing time with timeout protection
            Thread.sleep(PAYMENT_TIMEOUT_MS);
            
            // In production, process actual payment
            // For now, simulate success
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("Payment processing interrupted", e);
            return false;
        }
    }

    private void validateOrderAmount(Double amount) {
        if (amount == null) {
            throw new IllegalArgumentException("Order amount cannot be null");
        }
        
        long amountInPaise = Math.round(amount * 100);
        
        if (amountInPaise < MIN_ORDER_AMOUNT || amountInPaise > MAX_ORDER_AMOUNT) {
            throw new IllegalArgumentException("Order amount out of valid range: " + amount);
        }
    }
}
