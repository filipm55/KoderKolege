package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.Image;
import Nadmapa.BytePit.repository.ImageRepository;
import Nadmapa.BytePit.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ImageServiceImpl implements ImageService {
    @Autowired
    private ImageRepository imageRepo;


    @Override
    public Image saveImage(MultipartFile file ) throws IOException {
        Image image = new Image();
        image.setData(file.getBytes());
        return imageRepo.save(image);
    }

    @Override
    public List<Image> viewAll() {
        return imageRepo.findAll();
    }



    @Override
    public Image viewById(long id) {
        return imageRepo.findById(id).get();
    }


}
