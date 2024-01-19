package Nadmapa.BytePit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.TimeZone;

@Configuration
@EnableWebMvc
public class Config implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://bytepit-gxla.onrender.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*") // Allowed request headers
                .allowCredentials(true);
    }

    @Bean
    public void setTimeZone(){
        TimeZone.setDefault(TimeZone.getTimeZone("Europe/Berlin"));
    }
}