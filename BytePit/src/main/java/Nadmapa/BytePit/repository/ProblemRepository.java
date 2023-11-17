package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, String> {


}
