package Nadmapa.BytePit.dto;

import Nadmapa.BytePit.domain.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.thymeleaf.util.StringUtils;

import java.math.BigDecimal;

public class CodeSubDTO {
    @JsonProperty("user")
    private User user;

    @JsonProperty("points")
    private BigDecimal points;

    @JsonProperty("time")
    private int time;

    @JsonProperty("percentage_of_total")
    private double percentageOfTotal;

    public CodeSubDTO(User user, BigDecimal points, int time, double percentageOfTotal) {
        this.user = user;
        this.points = points;
        this.time = time;
        this.percentageOfTotal = percentageOfTotal;
    }
    public CodeSubDTO(){}

}