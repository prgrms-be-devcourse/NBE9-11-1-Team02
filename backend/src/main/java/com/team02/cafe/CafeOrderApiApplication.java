package com.team02.cafe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class CafeOrderApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CafeOrderApiApplication.class, args);
    }
}