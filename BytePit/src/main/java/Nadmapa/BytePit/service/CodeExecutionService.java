package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.CodeSub;
import Nadmapa.BytePit.domain.ExecutionResult;
import Nadmapa.BytePit.domain.Problem;
import org.springframework.web.multipart.MultipartFile;

public interface CodeExecutionService {
    ExecutionResult execute(Long id, String code, String userInput);


    String submit(MultipartFile file, Long problemId, CodeSub codeSub);
}
