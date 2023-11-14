package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.User;
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
            System.out.println("Korisnik " + user.getUsername() + "nije potvrdio registraciju unutar 24 sata, brišem ga");
            userService.deleteUserById(user.getId());
        }
        executorService.shutdown();
    }


    public void checkIfUserIsConfirmedAfter24Hours(User user) {
        long delay = 24*60*60; // u sekundama je, ako želite npr nakon minute onda je delay=60;
        executorService.schedule(() -> checkIfUserIsConfirmed(user), delay, TimeUnit.SECONDS);
    }
}
