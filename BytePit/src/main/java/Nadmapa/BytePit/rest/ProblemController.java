package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.ProblemService;

import Nadmapa.BytePit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/problems")
public class ProblemController {

        @Autowired
        private ProblemService problemService;

        @Autowired
        private UserService userService;


        @GetMapping("")
        public List<Problem> listProblem(){
            return problemService.listAll();
        }

        @PostMapping("")
        public Problem createProblem(@RequestBody Problem problem){
            System.out.println("Pokusavamo spremit zadatak " + problem.getTitle() + " problem maker je " + problem.getProblemMaker() +
                    ", duration: " + problem.getDuration() + " priv: " + problem.isPrivate() + " points: " +  problem.getPoints()
                    +" type: "+problem.getText()+" text: " + problem.getText() + " primjeri za evaluaciju " + problem.getInputOutputExamples());

            return problemService.createProblem(problem);
        }
        @GetMapping("/{id}")
         public Problem getTaskElements(@PathVariable Long id) {
            Optional<Problem> problemOptional = problemService.getProblemById(id);

            Problem problem = problemOptional.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
            System.out.println(problem.getText());
            return problem;
         }
         @GetMapping("/byMakerId/{id}")
         public List<Problem> getProblemsByProblemMakerId(@PathVariable String id) {
            System.out.println("jesmo li tu? ");
        // Call your service method to get problems based on problem_maker_id
            return problemService.getProblemsByProblemMakerId(id);
    }
}
