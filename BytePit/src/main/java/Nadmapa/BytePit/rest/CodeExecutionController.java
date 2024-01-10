package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.repository.UserCodeFileRepository;
import Nadmapa.BytePit.service.CodeExecutionService;
import Nadmapa.BytePit.service.CodeSubService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class CodeExecutionController {

    @Autowired
    private CodeExecutionService ces;

    @Autowired
    private UserCodeFileRepository codeRepo;

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
            System.out.println(codeSub.getUser());
            System.out.println(codeSub.getProblem());

            codeRepo.save(codeSub);

            return "Code submission saved successfully";
        } catch (IOException e) {
            return "Error in processing file";
        }
    }
}
