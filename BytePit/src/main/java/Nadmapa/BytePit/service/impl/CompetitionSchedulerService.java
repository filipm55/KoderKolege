package Nadmapa.BytePit.service.impl ;

import Nadmapa.BytePit.service.CompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class CompetitionSchedulerService {

    private final TaskScheduler taskScheduler;
    private final CompetitionService competitionService;

    @Autowired
    public CompetitionSchedulerService(TaskScheduler taskScheduler, CompetitionService competitionService) {
        this.taskScheduler = taskScheduler;
        this.competitionService = competitionService;
    }


    public void scheduleCompetitionEnding(Long competitionId, LocalDateTime dateTimeOfEnding){
        taskScheduler.schedule(() -> competitionService.krajNatjecanja(competitionId), new CronTrigger(convertToCronExpression(dateTimeOfEnding)));
    }

    private String convertToCronExpression(LocalDateTime dateTimeOfEnding) {
        return DateTimeFormatter.ofPattern("ss mm HH dd MM ?")
                .withZone(ZoneId.systemDefault())
                .format(dateTimeOfEnding);
    }


}
