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

import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
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
            Map<User, LocalDateTime> mapa = competition.getPristupiliNatjecanju();
            if (mapa.containsKey(userService.getUserById(userId).get()) && competition.getDateTimeOfEnding().isAfter(LocalDateTime.now())) {
                return ResponseEntity.ok(true);
            }
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
                schedulerService.scheduleCompetitionEnding(competition.getId(), competition.getDateTimeOfEnding());
                System.out.println("Mijenjam vrijeme kraja natjecanja" + competition.getId() + " u " + competition.getDateTimeOfEnding());
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
        System.out.println("ENTERO SAM");
        try {

            Competition competition = competitionService.getCompetition(String.valueOf(competitionId));
            Map<User, LocalDateTime> mapa  = competition.getPristupiliNatjecanju();

            Optional<User> user = userService.getUserById(userId);
            if(user.isPresent()){
                //if((competition.getIsvirtual()!=null && (competition.getIsvirtual() && !competition.getName().equals("Virtualno")) || mapa.containsKey(user.get()))){ System.out.println("NESTO"); return; };
                User usercic = user.get();
                Set<Problem> problems = competition.getProblems();
                Duration ukupno = Duration.ofSeconds(0);
                for (Problem problem: problems) {
                    String problemDurationString = problem.getDuration();

                    String[] problemDurations = problemDurationString.split(":");
                    long minutes = Long.parseLong(problemDurations[0]);
                    long seconds = Long.parseLong(problemDurations[1]);
                    Duration problemDuration = Duration.ofMinutes(minutes).plusSeconds(seconds);
                    ukupno = ukupno.plus(problemDuration);
                }
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime endingForUser = now.plus(ukupno);
                mapa.put(usercic, endingForUser);
                competition.setPristupiliNatjecanju(mapa);
                competitionService.saveCompetition(competition);
            }

        } catch (Exception e) {
            System.out.println("Error");
        }
    }



    @GetMapping("/{competitionId}/competitors/{userId}/time")
    public LocalDateTime getDateOfEndingForUser(@PathVariable Long competitionId, @PathVariable Long userId){
        try {

            Competition competition = competitionService.getCompetition(String.valueOf(competitionId));
            Map<User, LocalDateTime> mapa = competition.getPristupiliNatjecanju();
            Optional<User> user = userService.getUserById(userId);
            if(user.isPresent()){
                LocalDateTime timeOfEnding = mapa.get(user.get());
                if(!competition.getIsvirtual() && timeOfEnding.isAfter(competition.getDateTimeOfEnding())) return null;
                return timeOfEnding;
            }
        } catch (Exception e) {
            System.out.println("Error");
        }
        return null;
    }


    @GetMapping("/{competitionId}")
    public ResponseEntity<Set<Problem>> getCompetitionProblems(@PathVariable Long competitionId) {

        try {

            Competition competition = competitionService.getCompetition(String.valueOf(competitionId));
            //System.out.println(competitionId + " " + competition);
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
