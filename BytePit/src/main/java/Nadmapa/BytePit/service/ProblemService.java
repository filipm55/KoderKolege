package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.User;


import java.util.List;
import java.util.Optional;

public interface ProblemService {

    List<Problem> listAll();
    Problem createProblem (Problem problem);

    Optional<Problem> getProblemById(Long id);

    List<Problem> getProblemsByProblemMakerId(String problem_maker_id);
}
