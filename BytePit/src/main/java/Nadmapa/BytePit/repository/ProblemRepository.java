package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, String> {


    List<Problem> findByProblemMakerId(String problem_maker_id);
}
