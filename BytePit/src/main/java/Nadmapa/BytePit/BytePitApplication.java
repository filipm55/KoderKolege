package Nadmapa.BytePit;

import Nadmapa.BytePit.config.InitialDataLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(InitialDataLoader.class)
public class BytePitApplication {

	public static void main(String[] args) {
		SpringApplication.run(BytePitApplication.class, args);
	}

}
