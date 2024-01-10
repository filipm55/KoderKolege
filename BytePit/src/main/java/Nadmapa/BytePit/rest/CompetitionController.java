package Nadmapa.BytePit.rest;
import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.service.CompetitionService;


import Nadmapa.BytePit.service.ImageService;
import Nadmapa.BytePit.service.ProblemService;
import Nadmapa.BytePit.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.management.OperatingSystemMXBean;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/competitions")
public class CompetitionController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private CompetitionService competitionService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private ProblemService problemService;

    @Autowired
    private UserService userService;

    @GetMapping("")
    public List<Competition> listCompetition(){
        return competitionService.listAll();
    }

    @PostMapping("")
    public ResponseEntity<String> createCompetition(
            @RequestParam("name") String name,
            @RequestParam("competitionMaker") Long competitionMakerId,
            @RequestParam("dateTimeOfBeginning") LocalDateTime dateTimeOfBeginning,
            @RequestParam("dateTimeOfEnding") LocalDateTime dateTimeOfEnding,
            @RequestParam("numberOfProblems") int numberOfProblems,
            @RequestParam("trophyPicture") MultipartFile trophyPicture,
            @RequestParam("problems") Long[] problemsId
    ){
        Competition competition = new Competition();
        Image trophyPic = null;
        if(!trophyPicture.isEmpty()){
            try {
                trophyPic = imageService.saveImage(trophyPicture);
                competition.setSlicica_pehara(true);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        Set<Problem> setProblem = new HashSet<>();
        for (Long id: problemsId) {
            Optional<Problem> problem = problemService.getProblemById(id);
            problem.ifPresent(setProblem::add);
        }
        Optional<User> competitionMaker = userService.getUserById(competitionMakerId);
        competition.setName(name);
        competition.addProblems(setProblem);
        competitionMaker.ifPresent(competition::setCompetitionMaker);
        competition.setDateTimeOfEnding(dateTimeOfEnding);
        competition.setDateTimeOfBeginning(dateTimeOfBeginning);
        competition.setNumberOfProblems(numberOfProblems);
        competition.setTrophyPicture(trophyPic);

        logger.info("Received request to create a competition: {}", competition);
        //return competitionService.createCompetition(competition);
        return  competitionService.createCompetition(competition);
    }
    @PutMapping("/{competitionId}")
    public ResponseEntity<String> updateCompetition(@PathVariable Long competitionId,
                                                    @RequestParam("name") String name,
                                                    @RequestParam("competitionMaker") Long competitionMakerId,
                                                    @RequestParam("dateTimeOfBeginning") LocalDateTime dateTimeOfBeginning,
                                                    @RequestParam("dateTimeOfEnding") LocalDateTime dateTimeOfEnding,
                                                    @RequestParam("numberOfProblems") int numberOfProblems,
                                                    @RequestParam("trophyPicture") MultipartFile trophyPicture,
                                                    @RequestParam("problems") Long[] problemsId
                                                    ) throws IOException {
        Optional<Competition> optionalCompetition = Optional.ofNullable(competitionService.getCompetition(String.valueOf(competitionId)));
        if(optionalCompetition.isPresent()){
            Competition competition = optionalCompetition.get();
            
            if(!Objects.equals(competitionMakerId, competition.getCompetitionMaker().getId())){
                Optional<User> cmptMkr = userService.getUserById(competitionId);
                if(cmptMkr.isPresent()){
                    User compMkr = cmptMkr.get();
                    if(!compMkr.getUserType().equals(UserType.ADMIN)){
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Samo admin i vlasnik natjecanja mogu mijenjati natjecanje!");
                    }
                }
                else return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Samo admin i vlasnik natjecanja mogu mijenjati natjecanje!");
            }

            Set<Problem> setProblemNew = new HashSet<>();
            for (Long id: problemsId) {
                Optional<Problem> problem = problemService.getProblemById(id);
                problem.ifPresent(setProblemNew::add);
            }
            competition.setProblems(setProblemNew);

            if(!competition.getDateTimeOfBeginning().equals(dateTimeOfBeginning)){
                competition.setDateTimeOfBeginning(dateTimeOfBeginning);
            }
            if(!competition.getDateTimeOfEnding().equals(dateTimeOfEnding)){
                competition.setDateTimeOfEnding(dateTimeOfEnding);
            }
            if(!competition.getName().equals(name)){
                competition.setName(name);
            }
            if(competition.getNumberOfProblems()!=numberOfProblems){
               competition.setNumberOfProblems(numberOfProblems);
            }
            if(!trophyPicture.isEmpty() && !competition.getTrophyPicture().getData().equals(trophyPicture.getBytes())){
                competition.getTrophyPicture().setData(trophyPicture.getBytes());
            }
            try{
                competitionService.saveCompetition(competition);
            }catch(Exception e){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Neuspješan update natjecanja s ID-om: " + competitionId);
            }
            return ResponseEntity.ok("Uspješan update podataka natjecanja s ID-om: " + competitionId);

        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Natjecanje s ID-om : " + competitionId +" nije pronađen u bazi");
    }

    @GetMapping("/{competitionId}")
    public ResponseEntity<Set<Problem>> getCompetitionProblems(@PathVariable Long competitionId) {

        try {

            Competition competition = competitionService.getCompetition(String.valueOf(competitionId));
            System.out.println(competitionId + " " + competition);
            LocalDateTime now = LocalDateTime.now();
            if(competition.getDateTimeOfBeginning().isAfter(now) || competition.getDateTimeOfEnding().isBefore(now)){
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            Set<Problem> problems = competition.getProblems();
            return new ResponseEntity<>(problems, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
