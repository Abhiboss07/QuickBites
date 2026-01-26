package com.quickbite.repository;

import com.quickbite.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // Basic search/filtering can be added here
    List<Restaurant> findAllByCuisineType(String cuisineType);
}
