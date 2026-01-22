package com.quickbite.controller;

import com.quickbite.model.Restaurant;
import com.quickbite.model.Review;
import com.quickbite.model.User;
import com.quickbite.repository.RestaurantRepository;
import com.quickbite.repository.ReviewRepository;
import com.quickbite.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Review>> getRestaurantReviews(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(reviewRepository.findByRestaurantId(restaurantId));
    }

    static class ReviewRequest {
        private Long restaurantId;
        private Integer rating;
        private String comment;

        public Long getRestaurantId() {
            return restaurantId;
        }

        public void setRestaurantId(Long restaurantId) {
            this.restaurantId = restaurantId;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }
}
