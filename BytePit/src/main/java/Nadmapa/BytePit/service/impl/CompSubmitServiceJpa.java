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
        List<CodeSub> submissions = codeSubRepository.findByCompetitionIdAndUsername(competitionId, username);
        BigDecimal totalPoints = submissions.stream()
                .map(CodeSub::getPoints)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalTime = submissions.stream().mapToInt(CodeSub::getTime).sum();
        Competition c = cr.getCompetition(String.valueOf(competitionId));
        CompRank compRank = new CompRank();
        compRank.setCompetition(c);
        compRank.setUser(ur.findByUsername(username));
        compRank.setPoints(totalPoints);
        compRank.setTime(totalTime);
        compRankRepository.save(compRank);
        return compRank;
    }
}
