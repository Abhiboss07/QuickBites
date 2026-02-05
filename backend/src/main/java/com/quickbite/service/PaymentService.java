package com.quickbite.service;

import com.quickbite.model.OrderEntity;
import com.quickbite.model.Payment;
import com.quickbite.repository.PaymentRepository;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final String RAZORPAY = "RAZORPAY";
    private static final String COD = "COD";
    private static final long MIN_AMOUNT = 0L;
    private static final long MAX_AMOUNT = 999999999L; // Max 9999999.99 in paise
    private static final String COMPLETED = "COMPLETED";
    private static final String FAILED = "FAILED";
    private static final String PENDING = "PENDING";

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
            if (amount == null) {
                throw new IllegalArgumentException("Amount cannot be null");
            }
            
            long amountInPaise = validateAndConvertAmount(amount);
            
            // Mock Razorpay order creation
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", receiptId != null ? receiptId : "receipt_default");
            orderRequest.put("payment_capture", 1);

            String orderId = "order_" + UUID.randomUUID().toString().substring(0, 8);
            logger.info("Created payment order: {} with amount: {}", orderId, amountInPaise);
            return orderId;
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid payment amount: {}", amount, e);
            throw e;
        } catch (Exception e) {
            logger.error("Failed to create payment order", e);
            throw new RuntimeException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            if (orderId == null || paymentId == null || signature == null) {
                logger.warn("Invalid payment verification parameters");
                return false;
            }
            
            String payload = orderId + "|" + paymentId;
            String expectedSignature = generateHmacSha256(payload, razorpayKeySecret);
            
            boolean isValid = expectedSignature.equals(signature);
            if (!isValid) {
                logger.warn("Payment signature verification failed for orderId: {}", orderId);
            }
            return isValid;
        } catch (Exception e) {
            logger.error("Error during payment verification", e);
            return false;
        }
    }

    public Payment processPayment(OrderEntity order, String paymentId, String signature) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setTransactionId(paymentId);
        payment.setPaymentMethod(RAZORPAY);
        payment.setPaymentDate(LocalDateTime.now());

        try {
            if (verifyPaymentSignature(order.getId().toString(), paymentId, signature)) {
                payment.setPaymentStatus(COMPLETED);
                logger.info("Payment verified successfully for orderId: {}", order.getId());
            } else {
                payment.setPaymentStatus(FAILED);
                logger.warn("Payment verification failed for orderId: {}", order.getId());
            }
        } catch (Exception e) {
            payment.setPaymentStatus(FAILED);
            logger.error("Error processing payment for orderId: {}", order.getId(), e);
        }

        return paymentRepository.save(payment);
    }

    public Payment createCashOnDeliveryPayment(OrderEntity order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(COD);
        payment.setPaymentStatus(PENDING);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId("COD_" + UUID.randomUUID().toString().substring(0, 8));
        
        logger.info("Created COD payment for orderId: {}", order.getId());
        return paymentRepository.save(payment);
    }

    private long validateAndConvertAmount(Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }
        
        long amountInPaise = Math.round(amount * 100);
        
        if (amountInPaise < MIN_AMOUNT || amountInPaise > MAX_AMOUNT) {
            throw new IllegalArgumentException("Amount out of valid range");
        }
        
        return amountInPaise;
    }

    private String generateHmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance(HMAC_SHA256);
        SecretKeySpec keySpec = new SecretKeySpec(
            secret.getBytes(StandardCharsets.UTF_8),
            0,
            secret.length(),
            HMAC_SHA256
        );
        mac.init(keySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(rawHmac);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
