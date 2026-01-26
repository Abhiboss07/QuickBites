package com.quickbite.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.SpringAnnotationScanner;

@Configuration
@Component
public class SocketConfig {
    
    private static final Logger log = LoggerFactory.getLogger(SocketConfig.class);

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        config.setPort(8081);
        config.setOrigin("*:*");
        config.setPingTimeout(60000);
        config.setPingInterval(25000);
        
        SocketIOServer server = new SocketIOServer(config);
        
        // Add connection listeners
        server.addConnectListener(client -> {
            log.info("Client connected: {}", client.getSessionId());
            client.sendEvent("welcome", "Welcome to QuickBite Real-time Service!");
        });
        
        server.addDisconnectListener(client -> {
            log.info("Client disconnected: {}", client.getSessionId());
        });
        
        return server;
    }
    
    @Bean
    public SpringAnnotationScanner springAnnotationScanner(SocketIOServer socketServer) {
        return new SpringAnnotationScanner(socketServer);
    }
}
