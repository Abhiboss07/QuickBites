package com.quickbite.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.quickbite.model.Role;
import com.quickbite.model.User;
import com.quickbite.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder,
            com.quickbite.repository.RestaurantRepository restaurantRepository) {
        return args -> {
            User adminUser = null;
            // Check if test user already exists
            if (!userRepository.findByEmail("test@quickbite.com").isPresent()) {
                User testUser = new User();
                testUser.setFullName("Test User");
                testUser.setEmail("test@quickbite.com");
                testUser.setPassword(passwordEncoder.encode("password123"));
                testUser.setPhoneNumber("1234567890");
                testUser.setRole(Role.USER);

                userRepository.save(testUser);
                System.out.println("Test user created: test@quickbite.com / password123");
            }

            // Check if admin user already exists
            if (!userRepository.findByEmail("admin@quickbite.com").isPresent()) {
                adminUser = new User();
                adminUser.setFullName("Admin User");
                adminUser.setEmail("admin@quickbite.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setPhoneNumber("0987654321");
                adminUser.setRole(Role.ADMIN);

                adminUser = userRepository.save(adminUser);
                System.out.println("Admin user created: admin@quickbite.com / admin123");
            } else {
                adminUser = userRepository.findByEmail("admin@quickbite.com").get();
            }

            // Seed Restaurants if empty
            if (restaurantRepository.count() == 0 && adminUser != null) {
                System.out.println("Seeding Restaurants...");

                // 1. Joe's Pizza (Real NYC Icon)
                com.quickbite.model.Restaurant r1 = new com.quickbite.model.Restaurant();
                r1.setName("Joe's Pizza");
                r1.setDescription("The authentic New York slice. Established in 1975.");
                r1.setCuisineType("Italian");
                r1.setAddress("7 Carmine St, New York, NY 10014");
                r1.setImageUrl(
                        "https://lh3.googleusercontent.com/p/AF1QipN30t0oW3F3T6vXh7z5t9k8F78b5n4G2j1h4K7L=s1360-w1360-h1020"); // Real
                                                                                                                               // Joe's
                                                                                                                               // Pizza
                                                                                                                               // image
                r1.setRating(4.9);
                r1.setIsOpen(true);
                r1.setOwner(adminUser);

                java.util.List<com.quickbite.model.MenuItem> m1 = new java.util.ArrayList<>();
                m1.add(createItem("Cheese Slice", "Classic NY cheese slice", 4.00, true,
                        "https://lh3.googleusercontent.com/p/AF1QipN30t0oW3F3T6vXh7z5t9k8F78b5n4G2j1h4K7L=s1360-w1360-h1020",
                        r1));
                m1.add(createItem("Pepperoni Slice", "Crispy pepperoni on cheese", 4.75, false,
                        "https://lh3.googleusercontent.com/p/AF1QipN0X5Z2y5Z3T4vXh7z5t9k8F78b5n4G2j1h4K7L=s1360-w1360-h1020",
                        r1));
                m1.add(createItem("Whole Pie", "Large cheese pizza", 28.00, true,
                        "https://lh3.googleusercontent.com/p/AF1QipN30t0oW3F3T6vXh7z5t9k8F78b5n4G2j1h4K7L=s1360-w1360-h1020",
                        r1));
                r1.setMenuItems(m1);
                restaurantRepository.save(r1);

                // 2. Nobu Downtown (Real High-end)
                com.quickbite.model.Restaurant r2 = new com.quickbite.model.Restaurant();
                r2.setName("Nobu Downtown");
                r2.setDescription("World-renowned Japanese cuisine and sushi.");
                r2.setCuisineType("Japanese");
                r2.setAddress("195 Broadway, New York, NY 10007");
                r2.setImageUrl(
                        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop");
                r2.setRating(4.8);
                r2.setIsOpen(true);
                r2.setOwner(adminUser);

                java.util.List<com.quickbite.model.MenuItem> m2 = new java.util.ArrayList<>();
                m2.add(createItem("Black Cod Miso", "Famous black cod with miso glaze", 42.00, false,
                        "https://images.unsplash.com/photo-1635526910429-041c2c363d67?q=80&w=2070", r2));
                m2.add(createItem("Spicy Tuna Roll", "Fresh tuna with spicy mayo", 14.00, false,
                        "https://images.unsplash.com/photo-1579584425555-c3ce178069a6?q=80&w=2071", r2));
                m2.add(createItem("Yellowtail Jalapeño", "Sashimi with yuzu soy", 29.00, false,
                        "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=2069", r2));
                r2.setMenuItems(m2);
                restaurantRepository.save(r2);

                // 3. Shake Shack (Real Fast Casual)
                com.quickbite.model.Restaurant r3 = new com.quickbite.model.Restaurant();
                r3.setName("Shake Shack");
                r3.setDescription("Modern day roadside burger stand.");
                r3.setCuisineType("American");
                r3.setAddress("Madison Square Park, New York, NY 10010");
                r3.setImageUrl("https://images.unsplash.com/photo-1550950158-d0d960d9f9dd?q=80&w=2070");
                r3.setRating(4.7);
                r3.setIsOpen(true);
                r3.setOwner(adminUser);

                java.util.List<com.quickbite.model.MenuItem> m3 = new java.util.ArrayList<>();
                m3.add(createItem("ShackBurger", "Cheeseburger with lettuce, tomato, ShackSauce", 7.99, false,
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899", r3));
                m3.add(createItem("Cheese Fries", "Crinkle cuts with cheese sauce", 4.99, true,
                        "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=1925", r3));
                m3.add(createItem("Chocolate Shake", "Hand-spun vanilla custard", 5.99, true,
                        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1887", r3));
                r3.setMenuItems(m3);
                restaurantRepository.save(r3);

                System.out.println("Restaurants seeded successfully!");
            }
        };

    }

    private com.quickbite.model.MenuItem createItem(String name, String desc, double price, boolean veg, String img,
            com.quickbite.model.Restaurant r) {
        com.quickbite.model.MenuItem item = new com.quickbite.model.MenuItem();
        item.setName(name);
        item.setDescription(desc);
        item.setPrice(price);
        item.setIsVeg(veg);
        item.setImageUrl(img);
        item.setAvailable(true);
        item.setRestaurant(r);
        return item;
    }
}
