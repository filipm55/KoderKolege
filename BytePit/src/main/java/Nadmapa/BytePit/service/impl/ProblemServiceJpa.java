package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.repository.ProblemRepository;
import Nadmapa.BytePit.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
@Service
public class ProblemServiceJpa implements ProblemService {
    @Autowired
    private ProblemRepository problemRepo;


    @Override
    public List<Problem> listAll() {
        return problemRepo.findAll();
    }

    @Override
    public Problem createProblem(Problem problem) {
        Assert.notNull(problem,"Problem must be given");
        return problemRepo.save(problem);
    }

}
