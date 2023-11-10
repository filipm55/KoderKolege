package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.impl.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private EmailSenderService emailservice;

    @GetMapping("")
    public List<User> listCompetitors(){
        return userService.listAll();
    }

    @PostMapping("")
    public ResponseEntity<String> createUser(@RequestBody User user){
        emailservice.sendSimpleEmail(user.getEmail(),"Dobrodošli u BytePit!\n" +
                "\n" +
                "Hvala vam što ste se registrirali. Vaš račun je uspješno aktiviran. Spremni ste za izazove natjecateljskog programiranja!\n" +
                "\n" +
                "Sretno kod rješavanja zadataka i neka kodovi budu u vašu korist!\n" +
                "\n" +
                "Tim BytePit","Potvrda registracije");
        return userService.createUser(user);
    }

}
