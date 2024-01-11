package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.CodeSub;

import java.util.Set;

public interface CodeSubService {
    void setUserAndProblem(CodeSub codeSub, String username, Long problemId);

    Set<Long> getSolvedProblemIdsByUserAndCompetition(String username, Long competitionId);

    void setCompetition(CodeSub codeSub, Long competitionId);
}

