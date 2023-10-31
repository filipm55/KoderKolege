package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.Competitor;
import Nadmapa.BytePit.repository.CompetitorRepository;
import Nadmapa.BytePit.service.CompetitorService;
import Nadmapa.BytePit.service.RequestDeniedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

@Service
public class CompetitorServiceJpa implements CompetitorService {

    @Autowired
    private CompetitorRepository competitorRepo;

    @Override
    public List<Competitor> listAll(){
        return competitorRepo.findAll();
    }

    @Override
    public Competitor createCompetitor (Competitor competitor){
        Assert.notNull(competitor,"Competitor must be given");
        if(competitorRepo.existsByEmail(competitor.getEmail()))
            throw new RequestDeniedException("već postoji natjecatelj s tim mailom");
        return competitorRepo.save(competitor);
    }

}
