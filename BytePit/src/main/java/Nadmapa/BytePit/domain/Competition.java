package Nadmapa.BytePit.domain;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class Competition {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private final User competitionMaker; //treba napravit da u controlleru on primi i trenutno logiranog usera? https://stackoverflow.com/questions/31159075/how-to-find-out-the-currently-logged-in-user-in-spring-boot
    private LocalDateTime dateTimeOfBeginning; // + DateTimeFormatter? https://www.javatpoint.com/java-localdatetime
    private LocalDateTime dateTimeOfEnding;

    private int numberOfProblems;

    private Problem[] problems;

    private boolean slicicaPehara; // ? ja i dalje ne kuzim sta je to

    public Competition(User competitionMaker, LocalDateTime dateTimeOfBeginning, LocalDateTime dateTimeOfEnding, Problem[] problems, boolean slicicaPehara) {
        this.competitionMaker =competitionMaker;
        this.dateTimeOfBeginning = dateTimeOfBeginning;
        this.dateTimeOfEnding = dateTimeOfEnding;
        this.problems = problems;
        this.slicicaPehara = slicicaPehara;
        this.numberOfProblems = problems.length;
    }

    public LocalDateTime getDateTimeOfBeginning() {
        return dateTimeOfBeginning;
    }

    public void setDateTimeOfBeginning(LocalDateTime dateTimeOfBeginning) {
        this.dateTimeOfBeginning = dateTimeOfBeginning;
    }

    public LocalDateTime getDateTimeOfEnding() {
        return dateTimeOfEnding;
    }

    public void setDateTimeOfEnding(LocalDateTime dateTimeOfEnding) {
        this.dateTimeOfEnding = dateTimeOfEnding;
    }

    public Problem[] getProblems() {
        return problems;
    }

    public void setProblems(Problem[] problems) {
        this.problems = problems;
        this.numberOfProblems = problems.length;
    }

    public boolean isSlicicaPehara() {
        return slicicaPehara;
    }

    public void setSlicicaPehara(boolean slicicaPehara) {
        this.slicicaPehara = slicicaPehara;
    }
}
