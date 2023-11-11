package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.Image;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.UserType;
import Nadmapa.BytePit.service.ImageService;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.impl.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private ImageService imageService;

    @Autowired
    private EmailSenderService emailservice;

    @GetMapping("")
    public List<User> listCompetitors(){
        return userService.listAll();
    }


    @PostMapping("")
    public ResponseEntity<String> createUser(
            @RequestParam("name") String name,
            @RequestParam("lastname") String lastname,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("userType") String userType,
            @RequestParam("image") MultipartFile file
    ) throws IOException {
        Image image;
        try {
            image = imageService.saveImage(file);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        User user = new User();
        user.setName(name);
        user.setLastname(lastname);
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setUserType(UserType.valueOf(userType)); //sus
        user.setImage(image);

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
                "Tim BytePit";


        emailservice.sendSimpleEmail(user.getEmail(),message,"Potvrda registracije");
        logger.info("Received request to create a user: {}", user);
        ResponseEntity<String> response = userService.createUser(user);
        logger.info("Response from userService: {}", response);
        return response;
    }
}
