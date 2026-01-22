package com.quickbite.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String paymentMethod; // e.g., "STRIPE", "RAZORPAY", "COD"

    private String paymentStatus; // "PENDING", "COMPLETED", "FAILED"

    private String transactionId;

    private LocalDateTime paymentDate;
}
