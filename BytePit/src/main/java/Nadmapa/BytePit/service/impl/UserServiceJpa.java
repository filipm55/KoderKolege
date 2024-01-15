package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.CodeSub;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.UserType;
import Nadmapa.BytePit.repository.UserCodeFileRepository;
import Nadmapa.BytePit.repository.UserRepository;

import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.RequestDeniedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceJpa implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserCodeFileRepository codesubrepo;

    @Override
    public List<User> listAll(){
        return userRepo.findAll();
    }

    @Override
    public void saveUser(User user) {
        userRepo.save(user);
    }

    @Override
    public User getUserByConfirmationHash(String confirmationHash) {
        return userRepo.findByConfirmationHash(confirmationHash);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }
    @Override
    public List<CodeSub> rjesavani(String username) {
        return codesubrepo.rjesavani(username);
    }

    @Override
    public User findByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    @Override
    public ResponseEntity<String> deleteUserById(Long id) {
        try{
            userRepo.deleteById(id);
            return ResponseEntity.ok("Korisnik uspješno izbrisan!");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Korisnik s ID-om " + id + " nije pronađen.");
        }
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
        return ResponseEntity.ok("Dobrodosli, " + savedUser.getUsername() + "! Provjerite mail s uputama kako potvrditi account");
    }
    @Transactional
    public int validateUser(String username, String password) { // AKO JE SVE OK ONDA VRACA 1, AKO NIJE CONFIRMED VRACA 0, A AKO NE POSTOJI ONDA VRACA -1
        User user = userRepo.findByUsername(username);

        if (user != null && user.getPassword().equals(password) ) {
            if(user.getConfirmed() && user.getUserType()== UserType.COMPETITOR ) return 1;
            else if (user.getConfirmed() && user.getConfirmedByAdmin() && user.getUserType()== UserType.COMPETITION_LEADER )return 1;
            else if(user.getUserType()==UserType.ADMIN) return 1;
            else if(user.getUserType()==  UserType.COMPETITION_LEADER  && user.getConfirmed() && !user.getConfirmedByAdmin()) return 2;
            else return 0;
        }
        return -1;
    }

}
