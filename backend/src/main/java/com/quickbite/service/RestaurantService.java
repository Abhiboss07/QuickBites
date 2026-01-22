package com.quickbite.service;

import com.quickbite.model.Restaurant;
import com.quickbite.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository repository;

    public RestaurantService(RestaurantRepository repository) {
        this.repository = repository;
    }

    public List<Restaurant> getAllRestaurants() {
        return repository.findAll();
    }

    public Restaurant getRestaurantById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return repository.save(restaurant);
    }

    public List<Restaurant> searchRestaurants(String query) {
        return repository.searchByName(query);
    }
}
