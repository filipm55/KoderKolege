package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.Competitor;
import Nadmapa.BytePit.service.CompetitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/competitors")
public class CompetitorController {
    @Autowired
    private CompetitorService competitorService;

    @GetMapping("")
    public List<Competitor> listCompetitors(){
        return competitorService.listAll();
    }

    @PostMapping("")
    public Competitor createCOmpetitor(@RequestBody Competitor competitor){
        return competitorService.createCompetitor(competitor);
    }
}
