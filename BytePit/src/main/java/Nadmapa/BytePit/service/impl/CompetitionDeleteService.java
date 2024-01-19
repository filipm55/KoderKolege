package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.domain.UserType;
import Nadmapa.BytePit.service.CompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class CompetitionDeleteService {
    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(50);

    @Autowired
    private CompetitionService competitionService;

    public void deleteVirtualAfter2H(Competition competition) {
        long delay = 2*60*60;
        executorService.schedule(() -> deleteCompetition(competition), delay, TimeUnit.SECONDS);
    }

    @Async
    public void deleteCompetition(Competition competition) {
        competition = competitionService.getCompetition(competition.getId().toString());
        System.out.println("Brisem" + competition.getName() + ", proslo je 2 sata");
        competitionService.deleteCompetitionById(competition.getId());
        executorService.shutdown();
    }
}
