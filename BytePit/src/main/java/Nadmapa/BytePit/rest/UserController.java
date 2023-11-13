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
import java.util.UUID;

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
        user.setConfirmationHash(UUID.randomUUID().toString());
        user.setConfirmed(false);

        String message="Bok " + user.getName() +  ", dobrodošli u BytePit!\n";
        if(user.getUserType()== UserType.COMPETITOR){
            message+="\n" +
                    "Hvala vam što ste se registrirali. Vaš račun je još samo potrebno aktivirati preko priloženog linka i onda ste spremni za izazove natjecateljskog programiranja!\n" +
                     "http://localhost:8080/confirm-registration?hash=" + user.getConfirmationHash() + "\n" +
                    "Sretno kod rješavanja zadataka i neka kodovi budu u vašu korist!\n" +
                    "\n" +
                    "Tim BytePit";
        }
        else message+="\n" +
                "Međutim fali nam još samo jedan korak do cilja.Molimo pričekajte da Vas administrator potvrdi kao voditelja.\n" +
                "Radujemo se našoj suradnji\n" +
                "Tim BytePit";


        emailservice.sendSimpleEmail(user.getEmail(),message,"Potvrda registracije");
        if(user.getUserType()==UserType.COMPETITION_LEADER){
            String adminmail = "bytepit.noreply@gmail.com";
            String message2="Želimo li potvrditi " + user.getName() + " da bude voditelj?" +
                    "http://localhost:8080/confirm-registration?hash=" + user.getConfirmationHash();
            emailservice.sendSimpleEmail(adminmail,message2,"Netko želi biti voditelj");
        }
        logger.info("Received request to create a user: {}", user);
        ResponseEntity<String> response = userService.createUser(user);
        logger.info("Response from userService: {}", response);
        return response;
    }
}
