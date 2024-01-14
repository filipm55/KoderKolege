package Nadmapa.BytePit;

import Nadmapa.BytePit.config.InitialDataLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@Import(InitialDataLoader.class)
@EnableScheduling
public class BytePitApplication {

	public static void main(String[] args) {
		SpringApplication.run(BytePitApplication.class, args);
	}

}
