package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.CompRank;
import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompRankRepository extends JpaRepository<CompRank, Long> {
    @Query(value = "SELECT u.id as userId, cr.username, cr.points, RANK() OVER (ORDER BY cr.points DESC) as rank " +
            "FROM comp_rank cr " +
            "JOIN users u ON cr.username = u.username " +
            "WHERE cr.competition_id = :competitionId", nativeQuery = true)
    List<Object[]> getCompetitionRanking(@Param("competitionId") Long competitionId);

    Optional<CompRank> findByUserAndCompetition(User user, Competition competition);

    @Query(value = "SELECT cr.* " +
            "FROM comp_rank cr " +
            "WHERE cr.competition_id = :competitionId",
            nativeQuery = true)
    Optional<CompRank> findByCompetition(Long competitionId);

}