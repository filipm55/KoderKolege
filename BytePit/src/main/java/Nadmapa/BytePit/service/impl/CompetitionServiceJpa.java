package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.repository.CompetitionRepository;
import Nadmapa.BytePit.service.CompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
@Service
public class CompetitionServiceJpa implements CompetitionService {
    @Autowired
    private CompetitionRepository competitionRepo;
    @Override
    public List<Competition> listAll() {
        return competitionRepo.findAll();
    }

    @Override
    public ResponseEntity<String> createCompetition(Competition competition) {
        Competition competition1 = competitionRepo.save(competition);
        return ResponseEntity.ok("Uspjesno stvoreno natjecanje s id-om:  " + competition1.getId() + "\n" +
                "Competiton maker je : " + competition1.getCompetitionMaker().getUsername());
    }
}
