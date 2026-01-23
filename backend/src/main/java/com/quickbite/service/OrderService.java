package com.quickbite.service;

import com.quickbite.dto.OrderItemRequest;
import com.quickbite.dto.OrderRequest;
import com.quickbite.model.*;
import com.quickbite.repository.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final AddressRepository addressRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
            RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository,
            AddressRepository addressRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional
    public OrderEntity placeOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Address address = null;
        if (request.getAddressId() != null) {
            address = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new RuntimeException("Address not found"));
        }

        OrderEntity order = new OrderEntity();
        order.setCustomer(user);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(address);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        // Iterate through items, creating OrderItem and associating strictly with this
        // OrderEntity
        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu Item not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // Link to the new OrderEntity
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(menuItem.getPrice());

            totalAmount += menuItem.getPrice() * itemRequest.getQuantity();
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    public List<OrderEntity> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return orderRepository.findByCustomerId(user.getId());
    }

    public OrderEntity getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<OrderEntity> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public OrderEntity updateOrderStatus(Long orderId, OrderStatus status) {
        OrderEntity order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
