package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.UserType;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.impl.EmailSenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;

@Controller
public class RegistrationController {

    @Autowired
    private EmailSenderService emailservice;
    @Autowired
    private UserService userService; // Prilagodite prema vašoj implementaciji

    @GetMapping("/confirm-registration")
    public String confirmRegistration(@RequestParam("hash") String confirmationHash, Model model) {
        User user = userService.getUserByConfirmationHash(confirmationHash);
        System.out.println("Received confirmationHash: " + confirmationHash);

        if (user != null && user.getConfirmed() == false) {
            user.setConfirmed(true);
            userService.saveUser(user);

            model.addAttribute("confirmationMessage", "Vaša registracija je uspješno potvrđena. Sada se možete prijaviti.");
            System.out.println("User: " + user);
            System.out.println("User Confirmed: " + user.getConfirmed());
            if(user.getUserType()== UserType.COMPETITION_LEADER){
                System.out.println("trebo bi se vracat sad mail??");
                emailservice.sendSimpleEmail(user.getEmail(),"Admin vam je potvrdio registraciju","Sada ste voditelj");
            }
            // Prikazivanje stranice s porukom potvrde
            return "confirmation";
        } else if (user != null && user.getConfirmed() == true) {
            // Korisnik je već potvrdio registraciju, redirectajte ga na stranicu prijave
            model.addAttribute("confirmationMessage", "Već ste potvrdili registraciju. Sada se možete prijaviti.");

            // Prikazivanje stranice s porukom potvrde
            return "confirmation";
        } else {
            model.addAttribute("confirmationMessage", "Pogrešan hash za potvrdu registracije.");
            return "confirmation";
        }
    }
}
