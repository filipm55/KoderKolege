package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.ExecutionResult;
import org.springframework.web.multipart.MultipartFile;

public interface CodeExecutionService {
    ExecutionResult execute(Long id, String code, String userInput);


    String submit(MultipartFile file);
}
