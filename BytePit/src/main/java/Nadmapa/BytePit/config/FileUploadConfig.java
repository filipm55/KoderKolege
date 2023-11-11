package Nadmapa.BytePit.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;



@Configuration
@ConfigurationProperties(prefix = "spring.servlet.multipart")
@EnableWebMvc
public class FileUploadConfig implements WebMvcConfigurer {

    private long maxFileSize = 10 * 1024 * 1024; // 10 MB
    private long maxRequestSize = 10 * 1024 * 1024; // 10 MB

    @Bean
    public ExceptionHandlerExceptionResolver exceptionHandlerExceptionResolver() {
        return new ExceptionHandlerExceptionResolver();
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public long getMaxRequestSize() {
        return maxRequestSize;
    }

    public void setMaxRequestSize(long maxRequestSize) {
        this.maxRequestSize = maxRequestSize;
    }
}
