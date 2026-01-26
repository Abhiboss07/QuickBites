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
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
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
                User adminUser = new User();
                adminUser.setFullName("Admin User");
                adminUser.setEmail("admin@quickbite.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setPhoneNumber("0987654321");
                adminUser.setRole(Role.ADMIN);
                
                userRepository.save(adminUser);
                System.out.println("Admin user created: admin@quickbite.com / admin123");
            }
        };
    }
}
