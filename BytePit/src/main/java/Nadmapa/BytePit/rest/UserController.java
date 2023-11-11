package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.UserType;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.impl.EmailSenderService;
import com.sun.tools.jconsole.JConsoleContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

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
        String message="Bok " + user.getName() +  ", dobrodošli u BytePit!\n";
        if(user.getUserType()== UserType.COMPETITOR){
             message+="\n" +
                     "Hvala vam što ste se registrirali. Vaš račun je još samo potrebno aktivirati preko priloženog linka i onda ste spremni za izazove natjecateljskog programiranja!\n" +
                     "\n" +
                     "Sretno kod rješavanja zadataka i neka kodovi budu u vašu korist!\n" +
                     "\n" +
                     "Tim BytePit";
        }
        else message+="\n" +
                "Radujemo se našoj suradnji\n" +
                "\n" +
                "Međutim fali nam još samo jedan korak do cilja.Molimo pričekajte da Vas administrator potvrdi kao voditelja.\n" +
                "\n" +
                "Tim BytePit";
        emailservice.sendSimpleEmail(user.getEmail(),message,"Potvrda registracije");
        logger.info("Received request to create a user: {}", user);
        ResponseEntity<String> response = userService.createUser(user);
        logger.info("Response from userService: {}", response);
        return response;
    }
}
