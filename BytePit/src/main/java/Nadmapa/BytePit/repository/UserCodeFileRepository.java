package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.CodeSub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;


public interface UserCodeFileRepository extends JpaRepository<CodeSub, Long> {
    @Query(value = "SELECT DISTINCT problem_id FROM code_submissions WHERE username = :username AND competition_id = :competitionId", nativeQuery = true)
    Set<Long> findDistinctProblemIdsByUsernameAndCompetitionId(String username, Long competitionId);

    @Query(value = "SELECT * FROM code_submissions WHERE competition_id = :competitionId AND username = :username", nativeQuery = true)
    List<CodeSub> findByCompetitionIdAndUsername(Long competitionId, String username);
}
