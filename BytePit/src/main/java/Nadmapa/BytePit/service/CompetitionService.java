package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.Competition;

import java.util.List;

public interface CompetitionService {
    List<Competition> listAll();
    Competition createCompetition (Competition competition);
}
