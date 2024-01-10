package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.CodeSub;
import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.repository.UserCodeFileRepository;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.CodeSubService;
import Nadmapa.BytePit.service.ProblemService;
import Nadmapa.BytePit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class CodeSubServiceJpa implements CodeSubService {
    @Autowired
    private UserService userService;

    @Autowired
    private ProblemService problemService;

    @Autowired
    private UserCodeFileRepository cr;

    @Override
    public void setUserAndProblem(CodeSub codeSub, String username, Long problemId) {
        User user = userService.getUserByUsername(username);
        Optional<Problem> problem = problemService.getProblemById(problemId);

        codeSub.setUser(user);
        problem.ifPresent(codeSub::setProblem);
    }

    @Override
    public Set<Long> getSolvedProblemIdsByUserAndCompetition(String username, Long competitionId) {
        return cr.findDistinctProblemIdsByUsernameAndCompetitionId(username, competitionId);
    }
}
