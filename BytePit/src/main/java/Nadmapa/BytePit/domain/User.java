package Nadmapa.BytePit.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

import java.util.Arrays;


@Entity
public class User {

   @Id
   private String username;

   private String name;
   private String lastname;
   private String password;
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

   public String getUsername() {
      return username;
   }

   public void setUsername(String username) {
      this.username = username;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getLastname() {
      return lastname;
   }

   public void setLastname(String lastname) {
      this.lastname = lastname;
   }

   public String getPassword() {
      return password;
   }

   public void setPassword(String password) {
      this.password = password;
   }

   public String getEmail() {
      return email;
   }

   public void setEmail(String email) {
      this.email = email;
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
