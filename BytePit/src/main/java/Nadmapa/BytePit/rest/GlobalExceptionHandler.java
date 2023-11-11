package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.service.RequestDeniedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RequestDeniedException.class)
    public ResponseEntity<?> handleRequestDeniedException(RequestDeniedException ex) {
        // Log the exception
        logger.error("RequestDeniedException caught: {}", ex.getMessage());

        // Create a response body with the exception message
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}
