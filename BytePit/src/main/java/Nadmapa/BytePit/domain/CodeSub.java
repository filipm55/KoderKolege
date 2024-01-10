package Nadmapa.BytePit.domain;


import Nadmapa.BytePit.repository.UserRepository;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

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

    @Column(name = "time_taken")
    @Getter @Setter
    private int time;

    @Lob
    @Column(name = "file_data")
    @Getter @Setter
    private byte[] fileData;

    @Column(name = "points")
    @Getter @Setter
    private Integer points;

    public CodeSub() {
        this.points = null;
    }
}
