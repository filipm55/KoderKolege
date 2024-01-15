package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Arrays;

@Entity(name = "USER")
@Table(name= "Users")
public class User {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Getter
   @Setter
   @Column(unique = true)
   private String username;
   @Getter
   @Setter
   private String name;
   @Getter @Setter
   private String lastname;
   @Getter @Setter
   private String password;
   @Getter @Setter
   @Column(unique = true)
   private String email;

   private String confirmationHash;

   private boolean confirmed;
   @Getter @Setter
   private boolean confirmedByAdmin;


   @OneToOne(cascade = CascadeType.ALL)
   @JoinColumn(name = "image_id", referencedColumnName = "id")
   private Image image; // MAX SIZE 1048576 bytes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (probo sam promijenit u fileuploadConfig al to ne radi ;_;)

   @Enumerated(EnumType.STRING)
   private UserType userType;
   public User(){

   }
   public User(String username, String name, String lastname, String password, String email, Image image, String userType) {
      this.username = username;
      this.name = name;
      this.lastname = lastname;
      this.password = password;
      this.email = email;
      this.image=image;


      this.userType = pronadiUserType(userType);
   }

   private UserType pronadiUserType(String userType) {
      for (UserType utype: UserType.values()) {
         if(utype.toString().equals(userType)) return utype;
      }
      throw new IllegalArgumentException("userType ne postoji: " + userType);
   }

   public Image getImage() { return image; }

   public void setImage(Image image) {
      this.image = image;
   }

   public UserType getUserType() { return userType; }

   public void setUserType(UserType userType) { this.userType = userType;}

   public String getConfirmationHash() {
      return confirmationHash;
   }

   public void setConfirmationHash(String confirmationHash) {
      this.confirmationHash = confirmationHash;
   }
   public boolean getConfirmed() {
      return confirmed;
   }

   public void setConfirmed(boolean confirmed) {
      this.confirmed = confirmed;
   }

   public boolean getConfirmedByAdmin() {
      return confirmedByAdmin;
   }

   public void setConfirmedByAdmin(boolean confirmedByAdmin) {
      this.confirmedByAdmin = confirmedByAdmin;
   }

   public Long getId() { return id;}

   @Override
   public String toString() {
      return "User{" +
              "username='" + username + '\'' +
              ", name='" + name + '\'' +
              ", lastname='" + lastname + '\'' +
              ", password='" + password + '\'' +
              ", email='" + email + '\'' +
              ", userType='" + userType.toString() + '\'' +
              '}';
   }

   public String getUsername() {
      return username;
   }

   public void setUsername(String username) {
      this.username = username;
   }
}
