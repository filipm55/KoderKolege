package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.Competition;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CompetitionService {
    List<Competition> listAll();
    ResponseEntity<String> createCompetition (Competition competition);
}
