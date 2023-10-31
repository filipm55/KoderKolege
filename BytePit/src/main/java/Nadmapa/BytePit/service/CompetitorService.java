package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.Competitor;

import java.util.List;

public interface CompetitorService {
    List<Competitor> listAll();
    Competitor createCompetitor (Competitor competitor);
}
