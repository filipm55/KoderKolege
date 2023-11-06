package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.Problem;


import java.util.List;

public interface ProblemService {

    List<Problem> listAll();
    Problem createProblem (Problem problem);

}
