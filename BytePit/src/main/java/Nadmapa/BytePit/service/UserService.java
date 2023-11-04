package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.User;

import java.util.List;

public interface UserService {
    List<User> listAll();
    User createUser (User user);
}
