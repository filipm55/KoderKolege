package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.CodeSub;

public interface CodeSubService {
    void setUserAndProblem(CodeSub codeSub, String username, Long problemId);
}

