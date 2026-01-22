package com.quickbite.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "restaurants")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-increment

    @Column(nullable = false)
    private String name;

    private String description;

    private String cuisineType; // e.g., "Italian", "Mexican"

    private String address;

    private String imageUrl; // Banner image

    private Double rating; // Computed average rating

    private Boolean isOpen;

    @OneToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<MenuItem> menuItems;
}
