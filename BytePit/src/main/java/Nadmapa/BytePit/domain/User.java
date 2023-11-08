package Nadmapa.BytePit.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;

@Entity(name = "USER")
@Table(name= "users_list")
public class User {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Getter
   @Setter
   private String username;
   @Getter
   @Setter
   private String name;
   @Getter @Setter
   private String lastname;
   @Getter @Setter
   private String password;
   @Getter @Setter
   private String email;

   @Lob  //Large object anotacija
   private byte[] image;

   @Enumerated(EnumType.STRING)
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
              ", userType='" + userType.toString() + '\'' +
              '}';
   }
}
