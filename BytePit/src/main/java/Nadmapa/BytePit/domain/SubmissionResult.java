package Nadmapa.BytePit.domain;

import java.math.BigDecimal;
import java.util.Map;

public class SubmissionResult {
    private BigDecimal points;
    private Map<String, String> outputResults;

    public SubmissionResult(BigDecimal points, Map<String, String> outputResults) {
        this.points = points;
        this.outputResults = outputResults;
    }

    public BigDecimal getPoints() {
        return points;
    }

    public Map<String, String> getOutputResults() {
        return outputResults;
    }
}
