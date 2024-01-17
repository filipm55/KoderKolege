package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.dto.VirtualCompRankDTO;
import Nadmapa.BytePit.repository.UserCodeFileRepository;
import Nadmapa.BytePit.repository.CompRankRepository;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.CompSubmitService;
import Nadmapa.BytePit.service.CompetitionService;
import jakarta.transaction.Transactional;
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

    @Override @Transactional
    public List<VirtualCompRankDTO> calculateRank(Long competitionId, String username) {
        Competition c = cr.getCompetition(String.valueOf(competitionId));
        if (c == null) {
            return Collections.emptyList();
        }
        List<CodeSub> submissions = codeSubRepository.findByCompetitionIdAndUsername(competitionId, username);
        Set<AbstractMap.SimpleEntry<BigDecimal, Integer>> pointsTimeSet = submissions.stream()
                .filter(submission -> submission.getPoints() != null)
                .map(submission -> new AbstractMap.SimpleEntry<>(submission.getPoints(), submission.getTime()))
                .collect(Collectors.toSet());
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
                    return points.multiply(BigDecimal.valueOf(0.9)).add(points.multiply(BigDecimal.valueOf(0.1 * (totalTime - time) / (double) totalTime)));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Object[]> previousCompetitionRanks = compRankRepository.getCompetitionRanking(competitionId);
        List<VirtualCompRankDTO> virtualCompetitionRanks = new ArrayList<>();
        for (Object[] rankRecord : previousCompetitionRanks) {
            VirtualCompRankDTO dto = new VirtualCompRankDTO();
            dto.setCompId((Long) rankRecord[0]);
            dto.setUsername((String) rankRecord[1]);
            dto.setPoints(totalPoints);
            dto.setRank(((Long) rankRecord[3]).intValue()); // Safely converts Long to Integer
            virtualCompetitionRanks.add(dto);
        }
        VirtualCompRankDTO userRankDto = new VirtualCompRankDTO();
        userRankDto.setCompId(competitionId);
        userRankDto.setUsername(username);
        userRankDto.setPoints(totalPoints);
        int userRank = 1;
        for (VirtualCompRankDTO rankDto : virtualCompetitionRanks) {
            if (rankDto.getPoints().compareTo(totalPoints) > 0) {
                userRank++;
            } else {
                break;
            }
        }
        userRankDto.setRank(userRank);
        virtualCompetitionRanks.add(userRank - 1, userRankDto);
        for (int i = userRank; i < virtualCompetitionRanks.size(); i++) {
            VirtualCompRankDTO dto = virtualCompetitionRanks.get(i);
            dto.setRank(dto.getRank() + 1);
        }
        codeSubRepository.deleteByIsVirtual();
        return virtualCompetitionRanks;
    }




    @Override @Transactional
    public List<VirtualCompRankDTO> virtualRandRank(Long competitionId, String username) {
        Competition c = cr.getCompetition(String.valueOf(competitionId));
        if (c == null) {
            return Collections.emptyList();
        }
        List<CodeSub> submissions = codeSubRepository.findByCompetitionIdAndUsername(competitionId, username);
        Set<AbstractMap.SimpleEntry<BigDecimal, Integer>> pointsTimeSet = submissions.stream()
                .filter(submission -> submission.getPoints() != null)
                .map(submission -> new AbstractMap.SimpleEntry<>(submission.getPoints(), submission.getTime()))
                .collect(Collectors.toSet());
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
                    return points.multiply(BigDecimal.valueOf(0.9)).add(points.multiply(BigDecimal.valueOf(0.1 * (totalTime - time) / (double) totalTime)));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        VirtualCompRankDTO userRankDto = new VirtualCompRankDTO();
        userRankDto.setCompId(competitionId);
        userRankDto.setUsername(username);
        userRankDto.setPoints(totalPoints);
        List<VirtualCompRankDTO> virtualCompetitionRanks = new ArrayList<>();
        virtualCompetitionRanks.add(userRankDto);
        System.out.println(userRankDto.toString());
        codeSubRepository.deleteByIsVirtual();
        return virtualCompetitionRanks;
    }

    private void updateCompRank(CompRank compRank, Long competitionId, String username) {
        List<CodeSub> submissions = codeSubRepository.findByCompetitionIdAndUsername(competitionId, username);
        Set<AbstractMap.SimpleEntry<BigDecimal, Integer>> pointsTimeSet = submissions.stream()
                .filter(submission -> submission.getPoints() != null)
                .map(submission -> new AbstractMap.SimpleEntry<>(submission.getPoints(), submission.getTime()))
                .collect(Collectors.toSet());
        Competition c = cr.getCompetition(String.valueOf(competitionId));
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
                    return points.multiply(BigDecimal.valueOf(0.9)).add(points.multiply(BigDecimal.valueOf(0.1 * (totalTime - time) / (double) totalTime)));
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
                    return points.multiply(BigDecimal.valueOf(0.9)).add(points.multiply(BigDecimal.valueOf(0.1 * (totalTime - time) / (double) totalTime)));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        CompRank compRank = new CompRank(user, c, totalPoints);
        System.out.println("create");
        System.out.println(totalPoints);
        return compRankRepository.save(compRank);
    }
}
