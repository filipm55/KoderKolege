package Nadmapa.BytePit.rest;
import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.service.CompetitionService;


import Nadmapa.BytePit.service.ImageService;
import Nadmapa.BytePit.service.ProblemService;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.impl.CompetitionDeleteService;
import Nadmapa.BytePit.service.impl.CompetitionSchedulerService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Autowired
    private CompetitionDeleteService competitionDeleteService;
    private final CompetitionSchedulerService schedulerService;

    @Autowired
    public CompetitionController(CompetitionSchedulerService schedulerService) {
        this.schedulerService = schedulerService;
    }




    @GetMapping("")
    public List<Competition> listCompetition(){

        return competitionService.listAll().stream().filter(competition -> {
            if(competition.getName()!=null)
               return !competition.getName().contains("Virtualno");
           return true;
        }).toList();
    }



    @GetMapping("/{competitionId}/competitors/{userId}")
    public ResponseEntity<Boolean> hasEnteredCompetition(@PathVariable Long competitionId, @PathVariable Long userId){
        try {

            Competition competition = competitionService.getCompetition(String.valueOf(competitionId));
            List<User> users = competition.getPristupiliNatjecanju();
            if(users.stream().anyMatch(user -> user.getId().equals(userId))) return ResponseEntity.ok(true);
            else return ResponseEntity.ok(false);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }



    @PostMapping("")
    public ResponseEntity<String> createCompetition(
            @RequestParam("name") String name,
            @RequestParam("competitionMaker") Long competitionMakerId,
            @RequestParam("dateTimeOfBeginning")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime dateTimeOfBeginning,
            @RequestParam("dateTimeOfEnding")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime dateTimeOfEnding,
            @RequestParam("numberOfProblems") int numberOfProblems,
            @RequestParam(value = "trophyPicture") MultipartFile trophyPicture,
            @RequestParam("problems") Long[] problemsId,
            @RequestParam("isvirtual") Boolean isvirtual

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

        competition.setIsvirtual(isvirtual);

        LocalDateTime now = LocalDateTime.now();
        if(competition.getDateTimeOfBeginning().isBefore(now) && competition.getDateTimeOfEnding().isBefore(now)){
            competition.setIsvirtual(true);
        }



        logger.info("Received request to create a competition: {}", competition);
        //return competitionService.createCompetition(competition);
        ResponseEntity<String> returnValue = competitionService.createCompetition(competition);
        //if(competition.getName().equals("Virtualno")) competitionDeleteService.deleteVirtualAfter2H(competition); //izbrisi sva za vjezbu nakon 2 sata
        schedulerService.scheduleCompetitionEnding(competition.getId(), competition.getDateTimeOfEnding());

        return returnValue;
    }
    @PutMapping("/{competitionId}")
    public ResponseEntity<String> updateCompetition(@PathVariable Long competitionId,
                                                    @RequestParam("name") String name,
                                                    @RequestParam("competitionMaker") String competitionMakerId,
                                                    @RequestParam("dateTimeOfBeginning") LocalDateTime dateTimeOfBeginning,
                                                    @RequestParam("dateTimeOfEnding") LocalDateTime dateTimeOfEnding,
                                                    @RequestParam("numberOfProblems") int numberOfProblems,
                                                    @RequestParam("trophyPicture") MultipartFile trophyPicture,
                                                    @RequestParam("problems") Long[] problemsId
                                                    ) throws IOException {
        Optional<Competition> optionalCompetition = Optional.ofNullable(competitionService.getCompetition(String.valueOf(competitionId)));
        if(optionalCompetition.isPresent()){
            Competition competition = optionalCompetition.get();
            System.out.println(competitionMakerId.toString() + " " + competition.getCompetitionMaker().getId());
            if(!competitionMakerId.equals(Long.toString(competition.getCompetitionMaker().getId()))){
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

    @PutMapping("/{competitionId}/competitors/{userId}")
    public void enterCompetition(@PathVariable Long competitionId, @PathVariable Long userId){
        try {

            Competition competition = competitionService.getCompetition(String.valueOf(competitionId));
            List<User> users = competition.getPristupiliNatjecanju();
            if((competition.getIsvirtual()!=null && competition.getIsvirtual()) || users.stream().anyMatch(user -> user.getId().equals(userId))){ System.out.println("NESTO"); return; };
            Optional<User> user = userService.getUserById(userId);
            if(user.isPresent()){
                users.add(user.get());
                competition.setPristupiliNatjecanju(users);
                competitionService.saveCompetition(competition);
            }

        } catch (Exception e) {
            System.out.println("Error");
        }
    }


    @GetMapping("/{competitionId}")
    public ResponseEntity<Set<Problem>> getCompetitionProblems(@PathVariable Long competitionId) {

        try {

            Competition competition = competitionService.getCompetition(String.valueOf(competitionId));
            System.out.println(competitionId + " " + competition);
            LocalDateTime now = LocalDateTime.now();
            if(competition.getDateTimeOfBeginning().isAfter(now)){
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

    @GetMapping("/competition/{competitiondId}")
    public Competition getCompetitonById(@PathVariable Long competitiondId){
        try{
            Competition competition = competitionService.getCompetition(String.valueOf(competitiondId));
            return competition;
        }catch(EntityNotFoundException e){
            return null;
        }
    }




}
