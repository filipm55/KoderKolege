package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.service.ProblemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/problems")
public class ProblemController {

        @Autowired
        private ProblemService problemService;

        @GetMapping("")
        public List<Problem> listProblem(){
            return problemService.listAll();
        }

        @PostMapping("")
        public Problem createProblem(@RequestBody Problem problem){
            return problemService.createProblem(problem);
        }
}
