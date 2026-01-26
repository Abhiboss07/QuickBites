package com.quickbite.service;

import java.util.List;

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
                    ci.getQuantity(),
                    ci.getMenuItem().getIsVeg());
            order.addItem(oi);
        }

        // Mock Payment
        if (processPaymentMock(order.getTotalPrice())) {
            order.setStatus(OrderStatus.PAID);
        } else {
            order.setStatus(OrderStatus.PENDING);
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
            Thread.currentThread().interrupt();
            return false;
        }
        // Validate amount and simulate payment processing
        if (amount == null || amount <= 0) {
            return false;
        }
        // In a real implementation, you would process the actual payment
        // For now, just return true to simulate successful payment
        return true;
    }
}
