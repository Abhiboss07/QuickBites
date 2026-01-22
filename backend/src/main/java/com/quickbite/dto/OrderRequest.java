package com.quickbite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class OrderRequest {
    private Long restaurantId;
    private Long addressId;
    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public OrderRequest(Long restaurantId, Long addressId, List<OrderItemRequest> items) {
        this.restaurantId = restaurantId;
        this.addressId = addressId;
        this.items = items;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
