package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.rest.UserController;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.RequestDeniedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    public ResponseEntity<String> createUser(User user) {
        final Logger logger = LoggerFactory.getLogger(UserServiceJpa.class);

        logger.info("Received request to create a user: {}", user);

        Assert.notNull(user, "Competitor must be given");

        logger.debug("Validating email: {}", user.getEmail());
        if (!userRepo.checkIfEmailValid(user.getEmail())) {
            logger.warn("Email validation failed for: {}", user.getEmail());
            throw new RequestDeniedException("email mora biti ispravan!");
        }

        logger.debug("Checking email and username existence...");
        if (userRepo.existsByEmail(user.getEmail())) {
            logger.warn("User with email already exists: {}", user.getEmail());
            throw new RequestDeniedException("vec postoji natjecatelj s tim mailom");
        }
        if (userRepo.existsByUsername(user.getUsername())) {
            logger.warn("User with username already exists: {}", user.getUsername());
            throw new RequestDeniedException("vec postoji natjecatelj s tim usernameom");
        }

        logger.debug("Saving user...");
        User savedUser = userRepo.save(user);
        logger.info("User registration successful. Welcome, {}!", savedUser.getUsername());
        return ResponseEntity.ok("Registracija uspjesna. Dobrodosli, " + savedUser.getUsername() + "!");
    }


}
