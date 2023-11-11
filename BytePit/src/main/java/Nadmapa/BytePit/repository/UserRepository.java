package Nadmapa.BytePit.repository;


import Nadmapa.BytePit.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,String> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    default boolean checkIfEmailValid(String email){
        String regex = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
                + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
        return email.matches(regex);
    }

    User findByUsername(String username);
}
