package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.domain.Problem;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface CompetitionService {
    List<Competition> listAll();
    ResponseEntity<String> createCompetition (Competition competition);


    public Competition getCompetition(String competitionId);

    void saveCompetition(Competition competition);

    void deleteCompetitionById(Long id);
}
