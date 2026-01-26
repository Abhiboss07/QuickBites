package com.quickbite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
@EntityScan("com.quickbite.model")
@EnableJpaRepositories("com.quickbite.repository")
public class QuickBiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuickBiteApplication.class, args);
	}

}
