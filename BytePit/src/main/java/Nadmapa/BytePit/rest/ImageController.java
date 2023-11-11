package Nadmapa.BytePit.rest;

import Nadmapa.BytePit.domain.Image;
import Nadmapa.BytePit.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/images")
public class ImageController {
    @Autowired
    private ImageService imageService;

    @GetMapping("")
    public ResponseEntity<byte[]> displayImage(@RequestParam("id") long id){
        Image image = imageService.viewById(id);
        byte[] imageBytes = null;
        imageBytes = image.getData();
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
    }
}
