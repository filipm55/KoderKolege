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
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

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
        Set<AbstractMap.SimpleEntry<BigDecimal, Integer>> pointsTimeSet = submissions.stream()
                .filter(submission -> submission.getPoints() != null)
                .map(submission -> new AbstractMap.SimpleEntry<>(submission.getPoints(), submission.getTime()))
                .collect(Collectors.toSet());
        Competition c = cr.getCompetition(String.valueOf(competitionId));
        int totalTime = (int) Duration.between(c.getDateTimeOfBeginning(), c.getDateTimeOfEnding()).getSeconds();
        BigDecimal totalPoints = pointsTimeSet.stream()
                .map(pair -> {
                    BigDecimal points = pair.getKey();
                    int time = pair.getValue();
                    return points.add(points.multiply(BigDecimal.valueOf(0.1 * (totalTime - time) / (double) totalTime)));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        System.out.println("update");
        System.out.println(totalPoints);
        compRank.setCompetition(c);
        compRank.setUser(ur.findByUsername(username));
        compRank.setPoints(totalPoints);
        // No need to explicitly save as JpaRepository automatically updates existing entities
    }

    private CompRank createCompRank(User user, Long competitionId, String username) {
        List<CodeSub> submissions = codeSubRepository.findByCompetitionIdAndUsername(competitionId, username);
        Set<AbstractMap.SimpleEntry<BigDecimal, Integer>> pointsTimeSet = submissions.stream()
                .filter(submission -> submission.getPoints() != null)
                .map(submission -> new AbstractMap.SimpleEntry<>(submission.getPoints(), submission.getTime()))
                .collect(Collectors.toSet());
        Competition c = cr.getCompetition(String.valueOf(competitionId));
        //int totalTime = (int) Duration.between(c.getDateTimeOfBeginning(), c.getDateTimeOfEnding()).getSeconds();

        Set<Problem> problems = c.getProblems();
        Duration ukupno = Duration.ofSeconds(0);
        for (Problem problem: problems) {
            String problemDurationString = problem.getDuration();

            String[] problemDurations = problemDurationString.split(":");
            long minutes = Long.parseLong(problemDurations[0]);
            long seconds = Long.parseLong(problemDurations[1]);
            Duration problemDuration = Duration.ofMinutes(minutes).plusSeconds(seconds);
            ukupno = ukupno.plus(problemDuration);
        }
        long totalTime = ukupno.toMillis();
        BigDecimal totalPoints = pointsTimeSet.stream()
                .map(pair -> {
                    BigDecimal points = pair.getKey();
                    int time = pair.getValue();
                    return points.add(points.multiply(BigDecimal.valueOf(0.2 * (totalTime - time) / (double) totalTime)));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        CompRank compRank = new CompRank(user, c, totalPoints);
        System.out.println("create");
        System.out.println(totalPoints);
        return compRankRepository.save(compRank);
    }
}
