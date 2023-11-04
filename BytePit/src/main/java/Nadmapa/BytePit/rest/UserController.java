package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("")
    public List<User> listCompetitors(){
        return userService.listAll();
    }

    @PostMapping("")
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }
}
