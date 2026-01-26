package com.quickbite.service;

import com.quickbite.model.*;
import com.quickbite.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class OrderService {

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
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Address address = null;
        if (addressId != null) {
            address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));
        }

        // Create Order
        Order order = new Order(user, cart.getRestaurant(), cart.getTotalPrice(), address);

        // Convert CartItems to OrderItems (snapshot)
        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem(
                    order,
                    ci.getMenuItem().getId(),
                    ci.getMenuItem().getName(),
                    ci.getPrice(),
                    ci.getQuantity(), // Ensure CartItem has this or get from menuItem? CartItem should have snapshot
                                      // price. wait, CartItem entity has price snapshot? Let's check. Yes, added in
                                      // Phase 4.
                    ci.getMenuItem().getIsVeg() // Assuming snapshot needed or just reference? OrderItem has isVeg
                                                // field. Good.
            );
            order.addItem(oi);
        }

        // Mock Payment
        if (processPaymentMock(order.getTotalPrice())) {
            order.setStatus(OrderStatus.PAID);
        } else {
            order.setStatus(OrderStatus.PENDING); // Or fail? For now, let's assume success mostly.
        }

        Order savedOrder = orderRepository.save(order);

        // Clear Cart
        cart.clear();
        cart.setRestaurant(null);
        cartRepository.save(cart);

        return savedOrder;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    private boolean processPaymentMock(Double amount) {
        // Simulate processing time
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 90% success rate, or just true for Phase 5 demo
        return true;
    }
}
