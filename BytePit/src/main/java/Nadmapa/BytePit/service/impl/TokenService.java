package Nadmapa.BytePit.service.impl;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import javax.crypto.spec.SecretKeySpec;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;

import java.util.Base64;
import java.util.Date;

public class TokenService {

    //private static final String SECRET_KEY = "mySecretKey"; // Ovo mozemo bilo sto staviti

    @Transactional
    public static String createToken(String subject) {
        byte[] keyBytes = new byte[32]; // Key length 256 bits (32 bytes)
        //byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);

        return Jwts.builder()
                .setSubject(subject)
                .signWith(Keys.hmacShaKeyFor(keyBytes))
                .compact();
    }

    @Transactional
    public static Claims decodeToken(String token) {
        //byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        byte[] keyBytes = new byte[32]; // Same key as used for token creation

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            // Handle invalid token
            return null;
        }
    }
}

