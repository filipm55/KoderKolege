package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.CodeSubmission;
import Nadmapa.BytePit.domain.ExecutionResult;
import Nadmapa.BytePit.service.CodeExecutionService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class CodeExecutionController {

    @Autowired
    private CodeExecutionService codeExecutionService;

    @PostMapping("/solution/{id}")
    public ExecutionResult executeCode(@PathVariable Long id, @RequestBody CodeSubmission submission) {
        return codeExecutionService.execute(id, submission.getCode(), submission.getInput());
    }
}
