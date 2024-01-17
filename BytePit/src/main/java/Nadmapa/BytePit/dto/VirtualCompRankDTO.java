package Nadmapa.BytePit.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class VirtualCompRankDTO {
    @Getter@Setter
    private Long userId;
    @Getter@Setter
    private String username;

    @Getter@Setter
    private BigDecimal points;

    @Getter@Setter
    private Integer rank;

    public VirtualCompRankDTO() {}

    public VirtualCompRankDTO(Long userId, String username, BigDecimal points, Integer rank) {
        this.userId = userId;
        this.username = username;
        this.points = points;
        this.rank = rank;
    }
}
