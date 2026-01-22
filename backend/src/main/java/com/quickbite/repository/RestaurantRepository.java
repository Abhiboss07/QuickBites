package com.quickbite.repository;

import com.quickbite.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByCuisineType(String cuisineType);

    @Query("SELECT r FROM Restaurant r WHERE r.name LIKE %?1%")
    List<Restaurant> searchByName(String keyword);

    List<Restaurant> findByOwnerId(Long ownerId);
}
