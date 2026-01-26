package com.quickbite.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class RateLimitConfig implements WebMvcConfigurer {

    private final ConcurrentHashMap<String, Integer> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> lastRequestTime = new ConcurrentHashMap<>();

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RateLimitInterceptor());
    }

    private class RateLimitInterceptor implements HandlerInterceptor {
        private static final int MAX_REQUESTS_PER_MINUTE = 60;
        private static final long MINUTE_IN_MILLIS = TimeUnit.MINUTES.toMillis(1);

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            String clientIp = getClientIpAddress(request);
            long currentTime = System.currentTimeMillis();

            // Clean old entries
            lastRequestTime.entrySet().removeIf(entry -> currentTime - entry.getValue() > MINUTE_IN_MILLIS);

            Long lastTime = lastRequestTime.get(clientIp);
            if (lastTime == null || currentTime - lastTime > MINUTE_IN_MILLIS) {
                requestCounts.put(clientIp, 1);
                lastRequestTime.put(clientIp, currentTime);
                return true;
            }

            int currentCount = requestCounts.getOrDefault(clientIp, 0);
            if (currentCount >= MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(429);
                response.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
                return false;
            }

            requestCounts.put(clientIp, currentCount + 1);
            return true;
        }

        private String getClientIpAddress(HttpServletRequest request) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        }
    }
}
