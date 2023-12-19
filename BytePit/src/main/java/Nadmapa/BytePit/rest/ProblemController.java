package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.ProblemService;

import Nadmapa.BytePit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
                    +" type: "+problem.getText()+" text: " + problem.getText());
            //userService.createUser(problem.getProblemMaker()); // ovo realno ne bi trebalo kad cemo spojit usera sa sessiona
            //problem.setProblemMaker(problem.getProblemMaker());
            return problemService.createProblem(problem);
        }
}
