package Nadmapa.BytePit.config;

import Nadmapa.BytePit.BytePitApplication;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.UserType;
import Nadmapa.BytePit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.stereotype.Component;

@Component
public class InitialDataLoader implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    public InitialDataLoader(UserRepository userRepository) {
        User user = new User();
        user.setUserType(UserType.ADMIN);
        user.setUsername("admin");
        user.setEmail("bytepit.noreply@gmail.com");
        user.setLastname("admin");
        user.setConfirmed(true);
        user.setImage(null);
        user.setName("admin");
        user.setPassword("admin");
        user.setConfirmedByAdmin(true);
      try{
          userRepository.save(user);
      }catch(Exception e){
         //
      }
    }

    @Override
    public void run(String... args) throws Exception {
       //
    }
}
