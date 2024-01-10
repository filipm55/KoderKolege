package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.ExecutionResult;

public interface CodeExecutionService {
    ExecutionResult execute(Long id, String code, String userInput);
}
