package com.quickbite.repository;

import com.quickbite.model.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByCustomerId(Long customerId);

    List<OrderEntity> findByRestaurantId(Long restaurantId);

    List<OrderEntity> findByDeliveryPartnerId(Long deliveryPartnerId);
}
