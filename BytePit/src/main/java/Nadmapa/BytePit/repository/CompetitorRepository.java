package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.Competitor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetitorRepository  extends JpaRepository<Competitor,String> {
    boolean existsByEmail(String email);
}
