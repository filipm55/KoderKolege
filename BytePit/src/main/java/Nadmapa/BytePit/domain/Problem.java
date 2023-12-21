package Nadmapa.BytePit.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
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
    @Column(name="problem_maker_id",length=255)
    @JsonProperty("problemMaker")
    private String problemMakerId;
    @Getter @Setter
    private String title;

    @Getter @Setter
    private int points;
    @Getter @Setter
    private String duration;
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

    public Problem(String problemMakerId, String title, int points, String duration, String text, String[] inputExample, String[] outputExample, boolean isPrivate, ProblemType problemType) {
        Assert.hasText(title, "Problem must have a title");
        Assert.notNull(duration, "Problem must have a duration");
        Assert.hasText(text, "Problem must have a text");
        Assert.notEmpty(inputExample, "Problem must have at least one input+output example");
        Assert.notEmpty(outputExample, "Problem must have at least one input+output example");
        this.problemMakerId=problemMakerId;
        this.title = title;
        this.points = points;

        this.duration=duration;
//        String[] parts = duration.split(":");
//
//        // Convert to Duration
//        try {
//            long minutes = Long.parseLong(parts[0]);
//            long seconds = Long.parseLong(parts[1]);
//
//
//            this.duration = Duration.ofMinutes(minutes).plusSeconds(seconds);
//        }catch(Error e)   {
//            System.out.println("Krivo zadano trajanje");
//        }
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
        for (String inputExample: input) {
            inputOutputExamples.remove(inputExample);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProblemMaker() {
        return problemMakerId;
    }

    public void setProblemMaker(String problemMaker) {
        this.problemMakerId = problemMaker;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setInputOutputExamples(Map<String, String> inputOutputExamples) {
        this.inputOutputExamples = inputOutputExamples;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean aPrivate) {
        isPrivate = aPrivate;
    }

    public ProblemType getProblemType() {
        return problemType;
    }

    public void setProblemType(ProblemType problemType) {
        this.problemType = problemType;
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
