package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.Image;
import Nadmapa.BytePit.domain.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageService {

    public Image saveImage(MultipartFile file) throws IOException;
    public List<Image> viewAll();

    public Image viewById(long id);

}
