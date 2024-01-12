package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.Image;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.UserType;
import Nadmapa.BytePit.service.ImageService;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.impl.EmailSenderService;
import Nadmapa.BytePit.service.impl.TokenService;
import Nadmapa.BytePit.service.impl.UserRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserRegistrationService registrationService;

    @Autowired
    private UserService userService;
    @Autowired
    private ImageService imageService;

    @Autowired
    private EmailSenderService emailservice;

    @Autowired
    public UserController(UserRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/byId/{id}")
    public User getUserById(@PathVariable Long id) {
       Optional<User> user = userService.getUserById(id);
       if(user.isPresent()){
           return user.get();
       }
       else return null;
    }

    @GetMapping("")
    public List<User> listConfirmedUsers() {
        List<User> allUsers = userService.listAll();
        return allUsers.stream()
                .filter(user -> (user.getConfirmed() && user.getUserType() == UserType.COMPETITOR) || (user.getConfirmed()  && user.getUserType() == UserType.COMPETITION_LEADER))
                .collect(Collectors.toList());
    }
    @GetMapping("/getadmin")
    public ResponseEntity<User> getAdminUser() {
        User adminUser = userService.findByUsername("admin");

        if (adminUser != null) {
            return ResponseEntity.ok(adminUser);
        } else {
            return ResponseEntity.notFound().build();
        }
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
        user.setConfirmedByAdmin(false);


        logger.info("Received request to create a user: {}", user);
        ResponseEntity<String> response = registrationService.createUser(user);
        registrationService.checkIfUserIsConfirmedAfter24Hours(user);
        if (response.getStatusCode().is2xxSuccessful()) {
            String message = "Bok " + user.getName() + ", dobrodošli u BytePit!\n";
            if (user.getUserType() == UserType.COMPETITOR) {
                message += "\n" +
                        "Hvala vam što ste se registrirali. Vaš račun je još samo potrebno aktivirati preko priloženog linka i onda ste spremni za izazove natjecateljskog programiranja!\n" +
                        "http://localhost:8080/confirm-registration?hash=" + user.getConfirmationHash() + "&email=" + user.getEmail() + "\n" +
                        "Sretno kod rješavanja zadataka i neka kodovi budu u vašu korist!\n" +
                        "\n" +
                        "Tim BytePit" +
                        "\n\n" +
                        "P.S. Imate 24 sata za potvrdu maila, nakon toga, vaš će korisnički račun biti izbrisan.";

            } else message += "\n" +
                    "Molimo Vas da potvrdite račun preko ovog linka \n" +
                    "http://localhost:8080/confirm-registration?hash=" + user.getConfirmationHash() + "&email=" + user.getEmail() + "\n\n" +
                    "Međutim fali nam još samo jedan korak do cilja.Molimo pričekajte da Vas administrator potvrdi kao voditelja.\n" +
                    "Radujemo se našoj suradnji\n" +
                    "Tim BytePit";


            emailservice.sendSimpleEmail(user.getEmail(), message, "Potvrda registracije");
           /* if (user.getUserType() == UserType.COMPETITION_LEADER) {
                String adminmail = "bytepit.noreply@gmail.com";
                String message2 = "Želimo li potvrditi " + user.getName() + " da bude voditelj?" +
                        "http://localhost:8080/confirm-registration?hash=" + user.getConfirmationHash() + "&email=" + adminmail +
                        "\n" +
                        "Moramo potvrditi u roku od 7 dana.";
                emailservice.sendSimpleEmail(adminmail, message2, "Netko želi biti voditelj");
            }*/
        }
        logger.info("Response from userService: {}", response);
        return response;
    }

    @GetMapping("/{token}")
    public User getUserByToken(@PathVariable String token) {
        return userService.getUserByUsername(TokenService.decodeToken(token).getSubject());

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id) {
        return userService.deleteUserById(id);
    }


    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id,
                                             @RequestParam("name") String name,
                                             @RequestParam("lastname") String lastname,
                                             @RequestParam("username") String username,
                                             @RequestParam("email") String email,
                                             @RequestParam("userType") String userType,
                                             @RequestParam("password") String password,

                                             @RequestParam("image") MultipartFile file) throws IOException {


        Optional<User> optionalUser = userService.getUserById(id);
        boolean imageChanged = false;
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String stariEmail = user.getEmail();

            // Provjera i ažuriranje svakog polja korisnika ako je prisutno u primljenim podacima
            if (!name.equals(user.getName())) {
                user.setName(name);
            }
            if (!lastname.equals(user.getLastname())) {
                user.setLastname(lastname);
            }
            if (!username.equals(user.getUsername())) {
                user.setUsername(username);
            }
            if (!email.equals(user.getEmail())) {
                user.setEmail(email);
            }
            if(!password.equals("") && !password.equals(user.getPassword())){
                user.setPassword(password);
            }
            if (!userType.toString().equals(user.getUserType().toString())) {
                switch (userType) {
                    case "COMPETITOR":
                        user.setUserType(UserType.COMPETITOR);
                        break;
                    case "COMPETITION_LEADER":
                        user.setConfirmedByAdmin(true);
                        user.setUserType(UserType.COMPETITION_LEADER);
                        break;
                }
            }
            if(!file.isEmpty() && !file.getBytes().equals(user.getImage().getData())){
                user.getImage().setData(file.getBytes());
                imageChanged=true;
            }

            try{
                userService.saveUser(user);
            }catch(Exception e){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Neuspješan update korisnika s ID-om: " + id);
            }
            String izmjenjenaSlika = "\n\tSlika profila vam nije promijenjena.";
            if(imageChanged){
                izmjenjenaSlika = "\n\tUz to, vaša slika profila je promijenjena.";
            }
            emailservice.sendSimpleEmail(stariEmail,"Poštovani,\n" +
                    "Administrator je izmjenio vaše podatke.\n" +
                    "Vaši novi podaci su:\n" +
                    "\tIme: " + user.getName() +
                    "\n\tPrezime: " + user.getLastname() +
                    "\n\tKorisničko ime:" + user.getUsername() +
                    "\n\tEmail: " + user.getEmail() +
                    "\n\tTip: "+ user.getUserType().toString() + izmjenjenaSlika
                    ,"Izmjenjeni osobni podaci!");
            return ResponseEntity.ok("Uspješan update podataka korisnika s ID-om: " + id);
        }


        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Korisnik s ID-om : " + id +" nije pronađen u bazi");
    }
}
