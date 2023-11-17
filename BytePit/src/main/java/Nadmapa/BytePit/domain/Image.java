package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.sql.Blob;

@Entity
@Table(name = "image")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private byte[] data;


    public Long getId() {
        return id;
    }
    public byte[] getData() {
        return data;
    }


    public void setData(byte[] data) {
        this.data = data;
    }



}
