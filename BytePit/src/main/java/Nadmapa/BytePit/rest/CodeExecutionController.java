package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.repository.UserCodeFileRepository;
import Nadmapa.BytePit.service.CodeExecutionService;
import Nadmapa.BytePit.service.CodeSubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class CodeExecutionController {

    @Autowired
    private CodeExecutionService ces;

    @Autowired
    private UserCodeFileRepository cr;

    @Autowired
     private CodeSubService cs;

    @PostMapping("/solution/{id}")
    public ExecutionResult executeCode(@PathVariable Long id, @RequestBody CodeSubmission submission) {
        return ces.execute(id, submission.getCode(), submission.getInput());
    }

    @PostMapping("/submit/{id}")
    public String submitCode(@PathVariable Long id,
                             @RequestParam("file") MultipartFile file,
                             @RequestParam("time") int time,
                             @RequestParam("user") String username,
                             @RequestParam("problem") Long problemId) {
        try {
            System.out.println(username);
            CodeSub codeSub = new CodeSub();
            cs.setUserAndProblem(codeSub, username, problemId);
            codeSub.setTime(time);
            codeSub.setFileData(file.getBytes());

            return ces.submit(file, problemId, codeSub);
        } catch (IOException e) {
            return "Error in processing file";
        }
    }

    @Autowired
    private CodeSubService codeSubService;

    @GetMapping("/problems/{competitionId}/{username}")
    public ResponseEntity<Set<Long>> getSolvedProblemIdsByUserAndCompetition(@PathVariable Long competitionId, @PathVariable String username) {
        Set<Long> problemIds = codeSubService.getSolvedProblemIdsByUserAndCompetition(username, competitionId);
        if (problemIds.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        System.out.println(problemIds);
        return ResponseEntity.ok(problemIds);
    }
}
