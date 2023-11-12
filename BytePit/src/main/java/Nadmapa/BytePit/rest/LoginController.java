package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.dto.LoginDTO;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.impl.TokenService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginController {

    @Autowired
    private UserService userService;

    private static final String SECRET_KEY = "yourSecretKey";


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            boolean isValidUser = userService.validateUser(loginDTO.getUsername(), loginDTO.getPassword());

            if (isValidUser) {
                String token = TokenService.createToken(loginDTO.getUsername());
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }
}
