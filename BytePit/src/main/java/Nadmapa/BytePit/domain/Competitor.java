package Nadmapa.BytePit.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
public class Competitor {

   @Id
   private String username;

   private String name;
   private String lastname;
   private String password;
   @Column(unique=true)
   private String email;
   //slika???

   public Competitor(){
      
   }
   public Competitor(String username, String name, String lastname, String password, String email) {
      this.username = username;
      this.name = name;
      this.lastname = lastname;
      this.password = password;
      this.email = email;
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

   @Override
   public String toString() {
      return "Competitor{" +
              "username='" + username + '\'' +
              ", name='" + name + '\'' +
              ", lastname='" + lastname + '\'' +
              ", password='" + password + '\'' +
              ", email='" + email + '\'' +
              '}';
   }
}
