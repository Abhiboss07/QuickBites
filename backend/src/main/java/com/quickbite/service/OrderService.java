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
        System.out.println("PlaceOrder started for user: " + user.getEmail());
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        System.out.println("Cart found with items: " + cart.getItems().size());

        Address address = null;
        if (addressId != null) {
            address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new RuntimeException("Address not found"));
            System.out.println("Address found: " + address.getId());
        }

        // Create Order
        Order order = new Order(user, cart.getRestaurant(), cart.getTotalPrice(), address);
        System.out.println("Order entity created (transient)");

        // Convert CartItems to OrderItems (snapshot)
        for (CartItem ci : cart.getItems()) {
            System.out.println("Processing CartItem: " + ci.getId());
            OrderItem oi = new OrderItem(
                    order,
                    ci.getMenuItem().getId(),
                    ci.getMenuItem().getName(),
                    ci.getPrice(),
                    ci.getQuantity(),
                    ci.getMenuItem().getIsVeg());
            order.addItem(oi);
        }
        System.out.println("OrderItems added");

        // Mock Payment
        if (processPaymentMock(order.getTotalPrice())) {
            order.setStatus(OrderStatus.PAID);
        } else {
            order.setStatus(OrderStatus.PENDING);
        }
        System.out.println("Payment processed, status: " + order.getStatus());

        Order savedOrder = orderRepository.save(order);
        System.out.println("Order saved: " + savedOrder.getId());

        // Clear Cart
        cart.clear();
        cart.setRestaurant(null);
        cartRepository.save(cart);
        System.out.println("Cart cleared");

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
        return true;
    }
}
