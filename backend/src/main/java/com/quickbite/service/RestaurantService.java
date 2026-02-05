package com.quickbite.service;

import com.quickbite.model.Restaurant;
import com.quickbite.repository.RestaurantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RestaurantService {
    
    private static final Logger logger = LoggerFactory.getLogger(RestaurantService.class);

    private final RestaurantRepository repository;

    public RestaurantService(RestaurantRepository repository) {
        this.repository = repository;
    }

    public List<Restaurant> getAllRestaurants() {
        try {
            List<Restaurant> restaurants = repository.findAll();
            logger.debug("Retrieved {} restaurants", restaurants.size());
            return restaurants;
        } catch (Exception e) {
            logger.error("Error retrieving all restaurants", e);
            throw new RuntimeException("Failed to retrieve restaurants", e);
        }
    }

    public Restaurant getRestaurantById(Long id) {
        if (id == null || id <= 0) {
            logger.warn("Invalid restaurant ID: {}", id);
            throw new IllegalArgumentException("Restaurant ID must be positive");
        }

        try {
            Restaurant restaurant = repository.findById(id)
                    .orElseThrow(() -> {
                        logger.warn("Restaurant not found with id: {}", id);
                        return new RuntimeException("Restaurant not found with id: " + id);
                    });
            logger.debug("Retrieved restaurant: {}", id);
            return restaurant;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error retrieving restaurant with id: {}", id, e);
            throw new RuntimeException("Failed to retrieve restaurant", e);
        }
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        if (restaurant == null) {
            throw new IllegalArgumentException("Restaurant cannot be null");
        }

        if (restaurant.getName() == null || restaurant.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Restaurant name is required");
        }

        try {
            Restaurant savedRestaurant = repository.save(restaurant);
            logger.info("Restaurant created successfully with id: {}", savedRestaurant.getId());
            return savedRestaurant;
        } catch (Exception e) {
            logger.error("Error creating restaurant", e);
            throw new RuntimeException("Failed to create restaurant", e);
        }
    }

    public List<Restaurant> searchRestaurants(String query) {
        if (query == null || query.trim().isEmpty()) {
            logger.warn("Empty search query provided");
            return getAllRestaurants();
        }

        try {
            List<Restaurant> results = repository.findByNameContainingIgnoreCase(query);
            logger.debug("Found {} restaurants matching query: {}", results.size(), query);
            return results;
        } catch (Exception e) {
            logger.error("Error searching restaurants with query: {}", query, e);
            throw new RuntimeException("Failed to search restaurants", e);
        }
    }
}
