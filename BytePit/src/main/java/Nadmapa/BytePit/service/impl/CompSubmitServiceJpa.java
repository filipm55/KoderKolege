package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.dto.VirtualCompRankDTO;
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
        System.out.println("calculateAndSaveCompRank");
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

    @Override
    public List<VirtualCompRankDTO> calculateRank(Long competitionId, String username) {
        Competition c = cr.getCompetition(String.valueOf(competitionId));
        if (c == null) {
            return Collections.emptyList();
        }
        int totalTime = (int) Duration.between(c.getDateTimeOfBeginning(), c.getDateTimeOfEnding()).getSeconds();
        List<CodeSub> submissions = codeSubRepository.findByCompetitionIdAndUsername(competitionId, username);
        BigDecimal totalPoints = submissions.stream()
                .filter(submission -> submission.getPoints() != null)
                .map(submission -> submission.getPoints().add(submission.getPoints().multiply(BigDecimal.valueOf(0.1 * (totalTime - submission.getTime()) / (double) totalTime))))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Object[]> previousCompetitionRanks = compRankRepository.getCompetitionRanking(competitionId);
        List<VirtualCompRankDTO> virtualCompetitionRanks = new ArrayList<>();
        for (Object[] rankRecord : previousCompetitionRanks) {
            VirtualCompRankDTO dto = new VirtualCompRankDTO();
            dto.setUserId((Long) rankRecord[0]);
            dto.setUsername((String) rankRecord[1]);
            dto.setPoints(totalPoints);
            dto.setRank(((Long) rankRecord[3]).intValue()); // Safely converts Long to Integer
            virtualCompetitionRanks.add(dto);
        }
        return virtualCompetitionRanks;
    }




    @Override
    public void virtualRandRank(Long competitionId, String username) {

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
