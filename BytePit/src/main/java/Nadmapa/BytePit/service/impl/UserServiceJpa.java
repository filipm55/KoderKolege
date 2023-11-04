package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.RequestDeniedException;
import org.springframework.beans.factory.annotation.Autowired;
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
    public User createUser (User user){
        Assert.notNull(user,"Competitor must be given");
        if(!userRepo.checkIfEmailValid(user.getEmail())) throw new RequestDeniedException("email mora biti isparava!");
        if(userRepo.existsByEmail(user.getEmail()))
            throw new RequestDeniedException("već postoji natjecatelj s tim mailom");
        return userRepo.save(user);
    }

}
