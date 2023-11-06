package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Set;

@Entity(name = "COMPETITION")
public class Competition {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @ManyToOne
    private User competitionMaker; //treba napravit da u controlleru on primi i trenutno logiranog usera? https://stackoverflow.com/questions/31159075/how-to-find-out-the-currently-logged-in-user-in-spring-boot
    private LocalDateTime dateTimeOfBeginning; // + DateTimeFormatter? https://www.javatpoint.com/java-localdatetime
    private LocalDateTime dateTimeOfEnding;

    private int numberOfProblems;
    @ManyToMany
    private Set<Problem> problems;

    private boolean slicicaPehara; // ? ja i dalje ne kuzim sta je to

    public Competition(User competitionMaker, LocalDateTime dateTimeOfBeginning, LocalDateTime dateTimeOfEnding, Set<Problem> problems, boolean slicicaPehara) {
        this.competitionMaker =competitionMaker;
        this.dateTimeOfBeginning = dateTimeOfBeginning;
        this.dateTimeOfEnding = dateTimeOfEnding;
        this.problems = problems;
        this.slicicaPehara = slicicaPehara;
        this.numberOfProblems = problems.size();
    }

    public Competition() {

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

    public Set<Problem> getProblems() {
        return problems;
    }

    public void setProblems(Set<Problem> problems) {
        this.problems = problems;
        this.numberOfProblems = problems.size();
    }

    public void addProblems(Set<Problem> problems){
        for (Problem problem: problems) {
            this.problems.add(problem);
        }
    }
    public void removeProblems(Set<Problem> problems){
        for (Problem problem: problems) {
            this.problems.remove(problem);
        }
    }

}
