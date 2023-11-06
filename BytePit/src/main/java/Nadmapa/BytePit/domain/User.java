package Nadmapa.BytePit.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;


@Entity(name = "USER")
public class User {

   @Id
   private String username;
   @Getter
   @Setter
   private String name;
   @Getter @Setter
   private String lastname;
   @Getter @Setter
   private String password;
   @Getter @Setter
   @Column(unique=true)
   private String email;

   @Lob  //Large object anotacija
   //@Column(name = "image_data")
   private byte[] image;

   private UserType userType; //mozda bi se mogo stvorit privatni enum usertype -> ovisi o frontendu kako FORM funkcionira (za konstruktor)
   public User(){

   }
   public User(String username, String name, String lastname, String password, String email, byte[] image, UserType userType) {
      this.username = username;
      this.name = name;
      this.lastname = lastname;
      this.password = password;
      this.email = email;
      this.image = image;
      this.userType = userType;
   }




   public byte[] getImage() { return image; }

   public void setImage(byte[] image) { this.image = image; }

   public UserType getUserType() { return userType; }

   public void setUserType(UserType userType) { this.userType = userType;}

   @Override
   public String toString() {
      return "User{" +
              "username='" + username + '\'' +
              ", name='" + name + '\'' +
              ", lastname='" + lastname + '\'' +
              ", password='" + password + '\'' +
              ", email='" + email + '\'' +
              ", image='" + Arrays.toString(image) + '\'' + // ovo je mozda sus
              ", userType='" + userType.toString() + '\'' +
              '}';
   }
}
