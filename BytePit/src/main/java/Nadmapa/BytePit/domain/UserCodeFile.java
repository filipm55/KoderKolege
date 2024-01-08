package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
public class UserCodeFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter@Setter
    private Long id;
    @Getter@Setter
    private String username;
    @Getter@Setter
    private Long taskId;
    @Lob // Large Object - for storing large data
    @Getter@Setter
    private String fileContent;
}
