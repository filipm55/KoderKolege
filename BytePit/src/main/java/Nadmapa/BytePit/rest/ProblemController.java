package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.UserType;
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

        @PutMapping("/{id}")
        public ResponseEntity<String> updateProblem(@PathVariable Long id,
                                                    @RequestBody Problem problemNovi){

            /* OCEKUJEM OVAKVE PODATKE:
            const requestData = {
            problemMaker: userData.id,
            title: taskName,
            points: taskPoints,
            duration: taskTime,
            text: taskText,
            inputOutputExamples: Object.fromEntries(
                examplePairs.map(({input, output}) => [input, output])
            ),
            isPrivate: Boolean(visibility),              // !!!!!!!!!!!!!!!!!! ovo bi po meni defaultno trebalo biti 1 te nakon
            problemType: taskCategory   ///      !!!!!!!!!!!!!!!!!!!!!!!! za sad ? petra nije stavila unos kategorije treba dodati
        };

        console.log(JSON.stringify(requestData));
        fetch('http://localhost:8080/problems/${id}', {   <- ID OD PROBLEMA KOJEG UPDATAS
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // If the response is OK, return the JSON data
            return response.json();
        })
            .then(data => {
                // Handle the JSON data
                console.log('Server response:', data);
                window.history.back();
                // Perform any additional actions based on the response
            })
            .catch(error => {
                // Handle errors, including network errors or server errors
                console.error('Error:', error.message);
            }); */
            Optional<Problem> problem2 = problemService.getProblemById(id);
            if(problem2.isPresent()){

                Problem problemStari = problem2.get();
                if(!problemStari.getProblemMaker().equals(problemNovi.getProblemMaker())){
                    Optional<User> problemMakerNovi = userService.getUserById(Long.valueOf(problemNovi.getProblemMaker()));
                    if(problemMakerNovi.isPresent()){
                        User prbMkr = problemMakerNovi.get();
                        if(!prbMkr.getUserType().equals(UserType.ADMIN)){
                            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Samo admin i vlasnik zadatka mogu mijenjati zadatak!");
                        }

                    }
                    else return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Samo admin i vlasnik zadatka mogu mijenjati zadatak!");
                }

                if(!problemStari.getText().equals(problemNovi.getText())){
                    problemStari.setText(problemNovi.getText());
                }
                if(!problemStari.getProblemType().equals(problemNovi.getProblemType())){
                    problemStari.setProblemType(problemNovi.getProblemType());
                }
                if(!problemStari.getIsPrivate().equals(problemNovi.getIsPrivate())){
                    problemStari.setIsPrivate(problemNovi.getIsPrivate());
                }

                if(!problemStari.getDuration().equals(problemNovi.getDuration())){
                    problemStari.setDuration(problemNovi.getDuration());
                }
                if(!problemStari.getInputOutputExamples().equals(problemNovi.getInputOutputExamples())){
                    problemStari.setInputOutputExamples(problemNovi.getInputOutputExamples());
                }
                if(problemStari.getPoints()!=problemNovi.getPoints()){
                    problemStari.setPoints(problemNovi.getPoints());
                }
                if(problemStari.getTitle().equals(problemNovi.getTitle())){
                    problemStari.setTitle(problemNovi.getTitle());
                }

                try{
                    problemService.saveProblem(problemStari);
                }catch(Exception e){
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Neuspješan update problema s ID-om: " + id);
                }
                return ResponseEntity.ok("Uspješan update podataka zadatka s ID-om: " + id);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Zadatak s ID-om : " + id +" nije pronađen u bazi");
            
        }

}
