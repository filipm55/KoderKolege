package Nadmapa.BytePit.rest;
import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.domain.Image;
import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.service.CompetitionService;


import Nadmapa.BytePit.service.ImageService;
import Nadmapa.BytePit.service.ProblemService;
import Nadmapa.BytePit.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
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

    @GetMapping("")
    public List<Competition> listCompetition(){
        return competitionService.listAll();
    }

    @PostMapping("")
    public ResponseEntity<String> createCompetition(
            @RequestParam("competitionMaker") Long competitionMakerId,
            @RequestParam("dateTimeOfBeginning") LocalDateTime dateTimeOfBeginning,
            @RequestParam("dateTimeOfEnding") LocalDateTime dateTimeOfEnding,
            @RequestParam("numberOfProblems") int numberOfProblems,
            @RequestParam("trophyPicture") MultipartFile trophyPicture,
            @RequestParam("problems") Long[] problemsId
    ){
        Competition competition = new Competition();
        Image trophyPic;
        try {
            trophyPic = imageService.saveImage(trophyPicture);
            competition.setSlicica_pehara(true);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        Set<Problem> setProblem = new HashSet<>();
        for (Long id: problemsId) {
            Optional<Problem> problem = problemService.getProblemById(id);
            problem.ifPresent(setProblem::add);
        }
        Optional<User> competitionMaker = userService.getUserById(competitionMakerId);

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
}
