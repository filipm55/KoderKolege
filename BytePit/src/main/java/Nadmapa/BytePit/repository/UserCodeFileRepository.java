package Nadmapa.BytePit.repository;

import Nadmapa.BytePit.domain.CodeSub;
import Nadmapa.BytePit.domain.UserCodeFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCodeFileRepository extends JpaRepository<CodeSub, Long> {
}