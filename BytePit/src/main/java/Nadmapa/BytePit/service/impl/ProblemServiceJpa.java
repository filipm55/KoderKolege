package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.repository.ProblemRepository;
import Nadmapa.BytePit.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

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
    @Override
    public Optional<Problem> getProblemById(Long id) {
        return problemRepo.findById(String.valueOf(id));
    }

    @Override
    public List<Problem> getProblemsByProblemMakerId(String problem_maker_id) {
        return problemRepo.findByProblemMakerId(problem_maker_id);
    }

    @Override
    public void saveProblem(Problem problem) {
        problemRepo.save(problem);
    }


}
