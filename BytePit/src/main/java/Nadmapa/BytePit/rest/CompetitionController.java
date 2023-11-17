package Nadmapa.BytePit.rest;
import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.service.CompetitionService;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/competitions")
public class CompetitionController {
    @Autowired
    private CompetitionService competitionService;

    @GetMapping("")
    public List<Competition> listCompetition(){
        return competitionService.listAll();
    }

    @PostMapping("")
    public Competition createCompetition(@RequestBody Competition competition){
        return competitionService.createCompetition(competition);
    }
}
