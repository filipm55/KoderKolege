package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.CodeSub;
import Nadmapa.BytePit.domain.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;


public interface UserCodeFileRepository extends JpaRepository<CodeSub, Long> {


    @Query(value = "SELECT * FROM code_submissions WHERE competition_id = :compId AND problem_id = :taskId AND percentage_of_total= 1", nativeQuery = true)
    List<CodeSub> find100percentsubs (Long compId,Long taskId);
    @Query(value = "SELECT * FROM code_submissions WHERE competition_id = :compId AND problem_id = :taskId ", nativeQuery = true)
    List<CodeSub> findAllSubs(Long id, Long taskId);

    @Query(value = "SELECT * FROM code_submissions WHERE competition_id = :compId AND username= :username ", nativeQuery = true)
    List<CodeSub> findAllUserSubs(Long id, String username);
    @Query(value = "SELECT * FROM code_submissions WHERE username= :username", nativeQuery = true)
    List<CodeSub> rjesavani (String username);

}
