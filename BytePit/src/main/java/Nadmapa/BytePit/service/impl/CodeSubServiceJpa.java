package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.CodeSub;
import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.repository.UserCodeFileRepository;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.CodeSubService;
import Nadmapa.BytePit.service.CompetitionService;
import Nadmapa.BytePit.service.ProblemService;
import Nadmapa.BytePit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class CodeSubServiceJpa implements CodeSubService {
    @Autowired
    private UserService userService;

    @Autowired
    private ProblemService problemService;

    @Autowired
    private CompetitionService competitionService;


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
        Competition c = competitionService.getCompetition(String.valueOf(competitionId));
        if (!c.getIsvirtual()) {
            System.out.println(cr.nonVirtual(username, competitionId));
            return cr.nonVirtual(username, competitionId); //ovo se salje na front da bi se moglo onemogucit ponovnu predaju istog zadatka
        }
        else {
            System.out.println(cr.virtual(username, competitionId));
            return cr.virtual(username,competitionId);
        }
    }

    @Override
    public void setCompetition(CodeSub codeSub, Long competitionId) {
        Competition competition = competitionService.getCompetition(String.valueOf(competitionId));
        codeSub.setCompetition(competition);
    }
}
