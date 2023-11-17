package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.UserType;
import Nadmapa.BytePit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;

import org.springframework.stereotype.Service;
import java.util.concurrent.*;


@Service
public class UserRegistrationService {

    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

    @Autowired
    private UserService userService;
    @Async
    public ResponseEntity<String> createUser(User user) {
       return userService.createUser(user);
    }

    @Async
    public void checkIfUserIsConfirmed(User user) {
        user = userService.getUserByUsername(user.getUsername());
        if(!user.getConfirmed()){
            System.out.println("Korisnik " + user.getUsername() + " nije potvrdio registraciju unutar 24 sata, brišem ga");
            userService.deleteUserById(user.getId());
        }
        executorService.shutdown();
    }


    public void checkIfUserIsConfirmedAfter24Hours(User user) {
        long delay = 24*60*60;

        if(!user.getUserType().equals((UserType.ADMIN))) executorService.schedule(() -> checkIfUserIsConfirmed(user), delay, TimeUnit.SECONDS); //ako nije admin za 24 sata mora confirmat!
        if(user.getUserType().equals(UserType.COMPETITION_LEADER)){
            delay = 24*60*60*7; //7 dana
            executorService.schedule(() -> checkIfUserIsConfirmedByAdmin(user), delay, TimeUnit.SECONDS);
        }
    }

    private void checkIfUserIsConfirmedByAdmin(User user) {
        try{
            user = userService.getUserByUsername(user.getUsername());
            if(!user.getConfirmedByAdmin()){
                System.out.println("Korisnika" + user.getUsername() + " administrator nije potvrdio unuta 7 dana, brišem ga");
                userService.deleteUserById(user.getId());
            }
        }catch (Exception e){
        }

    }
}
