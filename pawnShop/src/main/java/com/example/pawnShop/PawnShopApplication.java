package com.example.pawnShop;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@Slf4j
public class PawnShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(PawnShopApplication.class, args);
		log.info("Backend-core is running...");
	}

}
