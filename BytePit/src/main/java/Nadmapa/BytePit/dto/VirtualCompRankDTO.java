package Nadmapa.BytePit.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class VirtualCompRankDTO {
    @Getter@Setter
    private Long compId;
    @Getter@Setter
    private String username;

    @Getter@Setter
    private BigDecimal points;

    @Getter@Setter
    private Integer rank;

    public VirtualCompRankDTO() {}

    public VirtualCompRankDTO(Long compId, String username, BigDecimal points, Integer rank) {
        this.compId = compId;
        this.username = username;
        this.points = points;
        this.rank = rank;
    }

    @Override
    public String toString() {
        return "VirtualCompRankDTO{" +
                "compId=" + compId +
                ", username='" + username + '\'' +
                ", points=" + points +
                ", rank=" + rank +
                '}';
    }
}
