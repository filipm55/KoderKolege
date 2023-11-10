package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.RequestDeniedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

@Service
public class UserServiceJpa implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public List<User> listAll(){
        return userRepo.findAll();
    }

    @Override
    public ResponseEntity<String> createUser (User user) {
        Assert.notNull(user, "Competitor must be given");
        if (!userRepo.checkIfEmailValid(user.getEmail()))
            throw new RequestDeniedException("email mora biti isparavan!");
        try {
            if (userRepo.existsByEmail(user.getEmail())) {
                throw new RequestDeniedException("vec postoji natjecatelj s tim mailom");
            }
            if (userRepo.existsByUsername(user.getUsername())) {
                throw new RequestDeniedException("vec postoji natjecatelj s tim usernameom");
            }
            User savedUser = userRepo.save(user);
            return ResponseEntity.ok("Registracija uspjesna. Dobrodosli, " + savedUser.getUsername() + "!");
        } catch (RequestDeniedException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }

    }

}
