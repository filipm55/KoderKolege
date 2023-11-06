package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.Competition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetitionRepository extends JpaRepository<Competition, String> {
}
