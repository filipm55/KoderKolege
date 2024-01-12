package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "comp_rank")
public class CompRank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "competition_id", referencedColumnName = "id")
    @Getter @Setter
    private Competition competition;

    @ManyToOne
    @Getter @Setter
    @JoinColumn(name = "username", referencedColumnName = "username")
    private User user;

    @Getter @Setter
    @Column(name = "points", precision = 10, scale = 2)
    private BigDecimal points;

    @Getter @Setter
    @Column(name = "time")
    private Integer time;

    public CompRank () {}
}
