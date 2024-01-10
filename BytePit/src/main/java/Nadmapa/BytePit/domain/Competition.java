package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "COMPETITION")
public class Competition {

    @Id
    @GeneratedValue
    @Getter
    private Long id;

    @Getter @Setter
    private String name;

    @NotNull
    @ManyToOne
    @Getter @Setter
    private User competitionMaker; //treba napravit da u controlleru on primi i trenutno logiranog usera? https://stackoverflow.com/questions/31159075/how-to-find-out-the-currently-logged-in-user-in-spring-boot


    @Getter @Setter
    private LocalDateTime dateTimeOfBeginning; // + DateTimeFormatter? https://www.javatpoint.com/java-localdatetime
    @Getter @Setter
    private LocalDateTime dateTimeOfEnding;

    @Getter @Setter
    private int numberOfProblems;
    @Getter
    @ManyToMany
    private Set<Problem> problems = new HashSet<>();
    @Getter @Setter
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "trophyPicture", referencedColumnName = "id")
    private Image trophyPicture;
    @Getter @Setter
    private boolean slicica_pehara = false;

    public Competition(User competitionMaker, LocalDateTime dateTimeOfBeginning, LocalDateTime dateTimeOfEnding, Set<Problem> problems, Image trophyPicture, boolean slicica_pehara) {
        this.competitionMaker =competitionMaker;
        this.dateTimeOfBeginning = dateTimeOfBeginning;
        this.dateTimeOfEnding = dateTimeOfEnding;
        this.problems = problems;
        this.trophyPicture = trophyPicture;
        this.numberOfProblems = problems.size();
        this.slicica_pehara=slicica_pehara;
    }

    public Competition() {

    }


    public void setProblems(Set<Problem> problems) {
        this.problems = problems;
    }

    public Set<Problem> getProblems() {
        return problems;
    }

    public void addProblems(Set<Problem> problems){
        this.problems.addAll(problems);
    }
    public void removeProblems(Set<Problem> problems){
        for (Problem problem: problems) {
            this.problems.remove(problem);
        }
    }

    public void setTrophyPicture(Image trophyPicture) {
        this.trophyPicture = trophyPicture;
    }

}
