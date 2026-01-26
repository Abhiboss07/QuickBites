package com.quickbite.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickbite.model.Restaurant;
import com.quickbite.model.Review;
import com.quickbite.model.User;
import com.quickbite.repository.RestaurantRepository;
import com.quickbite.repository.ReviewRepository;
import com.quickbite.repository.UserRepository;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public ReviewController(ReviewRepository reviewRepository, UserRepository userRepository,
            RestaurantRepository restaurantRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody ReviewRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found"));

            Review review = new Review();
            review.setUser(user);
            review.setRestaurant(restaurant);
            review.setRating(request.getRating());
            review.setComment(request.getComment());

            return ResponseEntity.ok(reviewRepository.save(review));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Review>> getRestaurantReviews(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(reviewRepository.findByRestaurantId(restaurantId));
    }

    public static class ReviewRequest {
        private Long restaurantId;
        private int rating;
        private String comment;

        public Long getRestaurantId() { return restaurantId; }
        public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}
