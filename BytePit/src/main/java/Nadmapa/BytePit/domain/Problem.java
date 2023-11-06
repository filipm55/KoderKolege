package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.Assert;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
@Entity (name = "PROBLEM")
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @OneToOne
    private User problemMaker;
    @Getter @Setter
    private String title;

    @Getter @Setter
    private int points;
    @Getter @Setter
    private Duration duration;
    @Getter @Setter
    private String text;
    @ElementCollection
    @CollectionTable(name = "inputOutput_mapa", joinColumns = @JoinColumn(name = "problem_id"))
    @MapKeyColumn(name = "kljuc")
    @Column(name = "vrijednost")
    private Map<String, String> inputOutputExamples = new HashMap<>();
    /*
    U ovom primeru, mapa će biti mapirana u posebnu tabelu problem_inputOutputExamples. problem_id će biti strani ključ koji povezuje mapu sa entitetom Problem.

    Ovo će omogućiti čuvanje mape u bazi podataka. */
    @Getter @Setter
    private boolean isPrivate;
    @Getter @Setter
    private ProblemType problemType;

    public Problem(User problemMaker, String title, int points, Duration duration, String text, String[] inputExample, String[] outputExample, boolean isPrivate, ProblemType problemType) {
        Assert.hasText(title, "Problem must have a title");
        Assert.notNull(points, "Problem must have a points");
        Assert.notNull(duration, "Problem must have a duration");
        Assert.hasText(text, "Problem must have a text");
        Assert.notEmpty(inputExample, "Problem must have at least one input+output example");
        Assert.notEmpty(outputExample, "Problem must have at least one input+output example");
        this.problemMaker=problemMaker;
        this.title = title;
        this.points = points;
        this.duration = duration;
        this.text = text;
        addInputOutputExamples(inputExample, outputExample);
        this.isPrivate = isPrivate;
        this.problemType = problemType;
    }

    public Problem() {

    }



    public Map<String, String> getInputOutputExamples() {
        return inputOutputExamples;
    }

    public void setInputOutputExamples(String[] input, String[] output) {
        inputOutputExamples.clear();
       addInputOutputExamples(input, output);
    }
    public void addInputOutputExamples(String[] input, String[] output){
        for(int i=0; i<input.length && i<output.length; i++){
            inputOutputExamples.put(input[i], output[i]);
        }
    }

    public void removeInputOutputExamples(String[] input){
        for(int i=0; i<input.length; i++){
            inputOutputExamples.remove(input[i]);
        }
    }


    @Override
    public String toString() {
        return "Problem{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", points=" + points +
                ", duration=" + duration +
                ", text='" + text + '\'' +
                ", inputOutputExamples=" + inputOutputExamples.toString() +
                ", isPrivate=" + isPrivate +
                ", problemType=" + problemType.toString() +
                '}';
    }
}
