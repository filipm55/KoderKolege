package Nadmapa.BytePit.repository;



import Nadmapa.BytePit.domain.Image;
import Nadmapa.BytePit.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;



public interface ImageRepository extends JpaRepository<Image, Long> {

}