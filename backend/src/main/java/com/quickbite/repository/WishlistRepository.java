package com.quickbite.repository;

import com.quickbite.model.Restaurant;
import com.quickbite.model.User;
import com.quickbite.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findAllByUser(User user);

    Optional<Wishlist> findByUserAndRestaurant(User user, Restaurant restaurant);
}
