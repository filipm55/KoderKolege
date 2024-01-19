package Nadmapa.BytePit.domain;

import lombok.Getter;
import lombok.Setter;

public class ExecutionResult {
    @Getter @Setter
    private String output;
    @Getter @Setter
    private String error;

    public ExecutionResult(String output, String error) {
        this.output = output;
        this.error = error;
    }

}
