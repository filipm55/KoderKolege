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
    public String confirmRegistration(@RequestParam("hash") String confirmationHash,@RequestParam("email") String userEmail, Model model) {
        User user = userService.getUserByConfirmationHash(confirmationHash);
        System.out.println("Received confirmationHash: " + confirmationHash);

        if (user != null && (user.getConfirmed() == false && user.getEmail().equals(userEmail)) || (user.getConfirmedByAdmin() == false && !user.getEmail().equals(userEmail))) {
            System.out.println("provjera : "  + userEmail + " a drugo "+ user.getEmail() + "a jesu li isti " + userEmail==user.getEmail() + user.getEmail().equals(userEmail) );
            if(userEmail.equals(user.getEmail())) {
                user.setConfirmed(true);
            }
            else {
                user.setConfirmedByAdmin(true);
            }
            userService.saveUser(user);

            if(user.getUserType()==UserType.COMPETITOR) model.addAttribute("confirmationMessage", "Vaša registracija je uspješno potvrđena. Sada se možete prijaviti.");
            else model.addAttribute("confirmationMessage", "Vaša registracija je uspješno potvrđena. Sada još samo pričekajte da admin učini isto.");
            System.out.println("User: " + user);

            if(user.getUserType()== UserType.COMPETITION_LEADER){
                System.out.println("trebo bi se vracat sad mail??");
                emailservice.sendSimpleEmail(user.getEmail(),"Admin vam je potvrdio registraciju","Sada ste voditelj");
            }
            // Prikazivanje stranice s porukom potvrde
            return "confirmation";
        } else if (user != null && userEmail==user.getEmail() && user.getConfirmed() == true) {
            model.addAttribute("confirmationMessage", "Već ste potvrdili registraciju. Sada se možete prijaviti.");

            // Prikazivanje stranice s porukom potvrde
            return "confirmation";
        } else {
            model.addAttribute("confirmationMessage", "Pogrešan hash za potvrdu registracije.");
            return "confirmation";
        }
    }
}
