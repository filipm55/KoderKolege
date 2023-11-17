package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.repository.CompetitionRepository;
import Nadmapa.BytePit.service.CompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Competition createCompetition(Competition competition) {
        Assert.notNull(competition,"Problem must be given");
        return competitionRepo.save(competition);
    }
}
