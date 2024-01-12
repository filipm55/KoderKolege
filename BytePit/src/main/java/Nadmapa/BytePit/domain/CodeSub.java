package Nadmapa.BytePit.domain;


import Nadmapa.BytePit.repository.UserRepository;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;

@Entity
@Table(name = "code_submissions")
public class CodeSub {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username")
    @Getter @Setter
    private User user;

    @ManyToOne
    @JoinColumn(name = "problem_id", referencedColumnName = "id")
    @Getter @Setter
    private Problem problem;

    @ManyToOne
    @JoinColumn(name = "competition_id", referencedColumnName = "id")
    @Getter @Setter
    private Competition competition;

    @Column(name = "time_taken")
    @Getter @Setter
    private int time;

    @Lob
    @Column(name = "file_data")
    @Getter @Setter
    private byte[] fileData;

    @Getter @Setter
    @Column(name = "points", precision = 10, scale = 2)
    private BigDecimal points;

    public CodeSub() {
        this.points = null;
    }
}
