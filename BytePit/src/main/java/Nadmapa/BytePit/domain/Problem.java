package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class Problem {
    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    private final User problemMaker;
    private String title;
    private int points;

    private Duration duration;

    private String text;

    private Map<String, String> inputOutputExamples = new HashMap<>();

    private boolean isPrivate;

    private ProblemType problemType;

    public Problem(User problemMaker, String title, int points, Duration duration, String text, String[] inputExample, String[] outputExample, boolean isPrivate, ProblemType problemType) {
        this.problemMaker=problemMaker;
        this.title = title;
        this.points = points;
        this.duration = duration;
        this.text = text;
        addInputOutputExamples(inputExample, outputExample);
        this.isPrivate = isPrivate;
        this.problemType = problemType;
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

    public Duration getDuration() {
        return duration;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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
