package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.repository.CompetitionRepository;
import Nadmapa.BytePit.repository.UserCodeFileRepository;
import Nadmapa.BytePit.repository.CompRankRepository;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.CompSubmitService;
import Nadmapa.BytePit.service.CompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Objects;

@Service
public class CompSubmitServiceJpa implements CompSubmitService {

    @Autowired
    private UserCodeFileRepository codeSubRepository;

    @Autowired
    private CompRankRepository compRankRepository;

    @Autowired
    private CompetitionService cr;

    @Autowired
    private UserRepository ur;

    @Override
    public CompRank calculateAndSaveCompRank(Long competitionId, String username) {
        User user = ur.findByUsername(username);
        Competition competition = cr.getCompetition(String.valueOf(competitionId));

        Optional<CompRank> existingCompRank = compRankRepository.findByUserAndCompetition(user, competition);

        if (existingCompRank.isPresent()) {
            // If the record exists, update its values
            CompRank compRank = existingCompRank.get();
            updateCompRank(compRank, competitionId, username);
            return compRankRepository.save(compRank);
        } else {
            // If the record doesn't exist, create a new one
            return createCompRank(user, competitionId, username);
        }
    }

    private void updateCompRank(CompRank compRank, Long competitionId, String username) {
        List<CodeSub> submissions = codeSubRepository.findByCompetitionIdAndUsername(competitionId, username);
        BigDecimal totalPoints = submissions.stream()
                .map(CodeSub::getPoints)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalTime = submissions.stream().mapToInt(CodeSub::getTime).sum();
        Competition c = cr.getCompetition(String.valueOf(competitionId));

        compRank.setCompetition(c);
        compRank.setUser(ur.findByUsername(username));
        compRank.setPoints(totalPoints);
        compRank.setTime(totalTime);
        // No need to explicitly save as JpaRepository automatically updates existing entities
    }

    private CompRank createCompRank(User user, Long competitionId, String username) {
        List<CodeSub> submissions = codeSubRepository.findByCompetitionIdAndUsername(competitionId, username);
        BigDecimal totalPoints = submissions.stream()
                .map(CodeSub::getPoints)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalTime = submissions.stream().mapToInt(CodeSub::getTime).sum();
        Competition c = cr.getCompetition(String.valueOf(competitionId));

        CompRank compRank = new CompRank(user, c, totalPoints, totalTime);

        return compRankRepository.save(compRank);
    }
}
