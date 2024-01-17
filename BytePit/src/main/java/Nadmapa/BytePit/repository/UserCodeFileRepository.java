package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.CodeSub;
import Nadmapa.BytePit.domain.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;


public interface UserCodeFileRepository extends JpaRepository<CodeSub, Long> {


    @Query(value = "SELECT * FROM code_submissions WHERE competition_id = :compId AND problem_id = :taskId AND percentage_of_total= 1", nativeQuery = true)
    List<CodeSub> find100percentsubs (Long compId,Long taskId);
    @Query(value = "SELECT * FROM code_submissions WHERE competition_id = :compId AND problem_id = :taskId ", nativeQuery = true)
    List<CodeSub> findAllSubs(@Param("compId") Long compId, @Param("taskId") Long taskId);

    @Query(value = "SELECT * FROM code_submissions WHERE competition_id = :compId AND username= :username ", nativeQuery = true)
    List<CodeSub> findAllUserSubs(Long compId, String username);
    @Query(value = "SELECT * FROM code_submissions WHERE username= :username", nativeQuery = true)
    List<CodeSub> rjesavani (String username);

    @Query(value = "SELECT DISTINCT problem_id FROM code_submissions WHERE username = :username AND competition_id = :competitionId", nativeQuery = true)
    Set<Long> findDistinctProblemIdsByUsernameAndCompetitionId(String username, Long competitionId);

    @Query(value = "SELECT * FROM code_submissions WHERE competition_id = :competitionId AND username = :username", nativeQuery = true)
    List<CodeSub> findByCompetitionIdAndUsername(Long competitionId, String username);

    @Modifying
    @Query(value = "DELETE FROM code_submissions WHERE is_virtual = true", nativeQuery = true)
    void deleteByIsVirtual();
}
