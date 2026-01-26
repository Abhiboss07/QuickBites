package com.quickbite.service;

import com.quickbite.model.OrderEntity;
import com.quickbite.model.Payment;
import com.quickbite.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id:rzp_test_1234567890}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:1234567890}")
    private String razorpayKeySecret;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public String createPaymentOrder(Double amount, String receiptId) {
        try {
            // Mock Razorpay order creation for now
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", receiptId);
            orderRequest.put("payment_capture", 1);

            // Return mock order ID for now
            return "order_" + UUID.randomUUID().toString().substring(0, 8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            // Mock signature verification for now
            String payload = orderId + "|" + paymentId;
            String expectedSignature = org.apache.commons.codec.digest.HmacUtils.hmacSha256Hex(payload, razorpayKeySecret);
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }

    public Payment processPayment(OrderEntity order, String paymentId, String signature) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setTransactionId(paymentId);
        payment.setPaymentMethod("RAZORPAY");
        payment.setPaymentDate(LocalDateTime.now());

        if (verifyPaymentSignature(order.getId().toString(), paymentId, signature)) {
            payment.setPaymentStatus("COMPLETED");
        } else {
            payment.setPaymentStatus("FAILED");
        }

        return paymentRepository.save(payment);
    }

    public Payment createCashOnDeliveryPayment(OrderEntity order) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod("COD");
        payment.setPaymentStatus("PENDING");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId("COD_" + UUID.randomUUID().toString().substring(0, 8));
        return paymentRepository.save(payment);
    }
}
