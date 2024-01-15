package Nadmapa.BytePit.dto;

import Nadmapa.BytePit.domain.User;

import java.math.BigDecimal;

public class CodeSubDTO {
    private User user;
    private BigDecimal points;
    private int time;
    private double percentageOfTotal;

    public CodeSubDTO(User user, BigDecimal points, int time, double percentageOfTotal) {
        this.user = user;
        this.points = points;
        this.time = time;
        this.percentageOfTotal = percentageOfTotal;
    }
    public CodeSubDTO(){}

}