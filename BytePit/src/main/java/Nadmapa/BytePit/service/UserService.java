package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    List<User> listAll();
    ResponseEntity<String> createUser (User user);
    @Transactional
    boolean validateUser(String username, String password);
}
