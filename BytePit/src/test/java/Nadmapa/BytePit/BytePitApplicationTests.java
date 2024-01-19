package Nadmapa.BytePit;

import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.rest.UserController;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class BytePitApplicationTests {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private MockMvc mockMvc;



	private UserController userController;


	//Provjeravamo rade li osnovne funkcije razreda User (njih sve ostale funkcije koriste)
	//Konkretno u ovom testu provjeravamo hoće li naš razred u konstruktoru dobro "zapamtiti" vrijednosti parametara, koje kasnije dohvaćamo get metodama, to se npr koristi kada se vrši registracija
	@Test
	void getterTest(){
		User user = new User("korisnik1", "ime", "prezime", "lozinka", "ime.prezime@gmail.com", null, "COMPETITOR");
		assertEquals("korisnik1", user.getUsername());
		assertEquals("ime", user.getName());
		assertEquals("prezime", user.getLastname());
		assertEquals("lozinka", user.getPassword());
		assertEquals("ime.prezime@gmail.com", user.getEmail());
		assertEquals(null, user.getImage());
		assertEquals(UserType.COMPETITOR, user.getUserType());

	}
	//Provjeravamo rade li osnovne funkcije razreda User (njih sve ostale funkcije koriste)
	//Konrektno u ovom primjeru provjeravamo možemo li set metodama razreda User mijenjati njegove atribute (to se npr koristi kada se mijenjaju podaci od korisnika na natjecanju)
	@Test
	void setterTest(){
		User user = new User("korisnik1", "ime", "prezime", "lozinka", "ime.prezime@gmail.com", null, "COMPETITOR");
		user.setUsername("korisnik1_update");
		user.setName("ime_update");
		user.setLastname("prezime_update");
		assertEquals("korisnik1_update", user.getUsername());
		assertEquals("ime_update", user.getName());
		assertEquals("prezime_update", user.getLastname());
		assertEquals("lozinka", user.getPassword());
		assertEquals("ime.prezime@gmail.com", user.getEmail());
		assertEquals(null, user.getImage());
		assertEquals(UserType.COMPETITOR, user.getUserType());
	}

	//Provjeravamo rade li osnove funkcije razreda Problem i Competition (njih sve ostale funkcije koriste)
	//Konkretno u ovom primjeru provjeravamo možemo li stvoriti novi problem(tj zadatak) i novi Competition i dodati problem u competition (to se koristi kada se stvaraju natjecanja i dodaju se koji će zadaci biti dio tog natjecanja)

	@Test
	void competitionGetProblemsTest(){
		Map<String,String> mapa = new HashMap<>();
		mapa.put("ulaz", "izlaz");

		Problem problem = new Problem("1", "naslov", 5, "10:00", "text" , mapa, false, ProblemType.HARD);
		User user = new User("korisnik1", "ime", "prezime", "lozinka", "ime.prezime@gmail.com", null, "COMPETITION_LEADER");
		Set<Problem> set = new HashSet<>();
		set.add(problem);
		Competition competition = new Competition(user, LocalDateTime.now(), LocalDateTime.now(), set, null, false, false);
		assertEquals(set, competition.getProblems());
	}
	//Provjeravamo slučaj kada neko natjecanje nema sličicu trofeja
	//To se koristi kada prikazujemo statistiku korisnika (ako nema sličice natjecanja, onda se prikazuje neka "default" ikona pehara
	@Test
	void competitionNoTrophyPictureThrowsTest(){
		Map<String,String> mapa = new HashMap<>();
		mapa.put("ulaz", "izlaz");

		Problem problem = new Problem("1", "naslov", 5, "10:00", "text" , mapa, false, ProblemType.HARD);
		User user = new User("korisnik1", "ime", "prezime", "lozinka", "ime.prezime@gmail.com", null, "COMPETITION_LEADER");
		Set<Problem> set = new HashSet<>();
		set.add(problem);
		Competition competition = new Competition(user, LocalDateTime.now(), LocalDateTime.now(), set, null, false, false);
		assertThrows(NullPointerException.class, () ->  competition.getTrophyPicture().getData());
	}
	//Provjeravamo kompleksnije funkcije sustava
	//Konkretno provjeravamo možemo li iz baze podataka izvući nekog usera
	//Provjeru radimo uspoređivanjem savedUser.id (on je u bazi) i jsonNode.get("id") <- jsonNode je objekt koji iz predstavlja odgovor na naš get zahtjev na server (metoda bi trebala iz baze povući usera sa nekim id-em)
	//Dakle gledamo hoće li get zahtjev vratiti točan podatak iz baze
	@Test
	@DirtiesContext
	void testGetUserById() throws Exception{
		User user = new User("korisnik1", "ime", "prezime", "lozinka", "ime.prezime@gmail.com", null, "COMPETITION_LEADER");
		userRepository.delete(user);
		User savedUser = userRepository.save(user);
		MvcResult result = mockMvc.perform(get("/users/byId/{id}", savedUser.getId()))
				.andExpect(status().isOk())
				.andReturn();
		userRepository.deleteById(savedUser.getId());

		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());

		assertEquals(savedUser.getId(), jsonNode.get("id").asLong());
	}
	//Provjeravamo radi li put metoda za stvaranje korisnika (koristi se prilikom registracije)
	//Slično kao i u prošlom primjeru provjeravamo hoće li nam get metoda vratiti dobrog korisnika, kojeg ovog puta ne upisujemo direktno u bazu, već put metodom
	@Test
	@DirtiesContext
	void createUserTest() throws Exception{
		MockMultipartFile file = new MockMultipartFile(
				"image",           // Parametar "image" iz metode
				"filename.jpg",    // Naziv datoteke
				MediaType.IMAGE_JPEG_VALUE, // Tip datoteke
				"file content".getBytes()   // Sadržaj datoteke
		);

		MvcResult resultFromCreateUser = mockMvc.perform(MockMvcRequestBuilders.multipart("/users")
						.file(file)
						.param("name", "ime2")
						.param("lastname", "prezime2")
						.param("username", "korisnik2")
						.param("email", "ime.prezime2@gmail.com")
						.param("password", "lozinka2")
						.param("userType", "COMPETITION_LEADER"))

				.andExpect(status().isOk())
				.andReturn();

		User userFromDatabase = userRepository.findByUsername("korisnik2");

		MvcResult resultFromGetUser = mockMvc.perform(get("/users/byId/{id}", userFromDatabase.getId()))
				.andExpect(status().isOk())
				.andReturn();


		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode = objectMapper.readTree(resultFromGetUser.getResponse().getContentAsString());
		userRepository.delete(userFromDatabase);
		assertEquals(userFromDatabase.getId(), jsonNode.get("id").asLong());
	}
	//Provjeravamo uvjete za stvaranje korisnika
	//Konkretno ovdje pokušavamo stvoriti 2 korisnika sa istim usernameom
	//Provjeravamo hoće li nam server vratiti neki error
	@Test
	void uniqueUsernameTest() throws  Exception{
		MockMultipartFile file = new MockMultipartFile(
				"image",           // Parametar "image" iz metode
				"filename.jpg",    // Naziv datoteke
				MediaType.IMAGE_JPEG_VALUE, // Tip datoteke
				"file content".getBytes()   // Sadržaj datoteke
		);

		MvcResult resultFromCreateUser = mockMvc.perform(MockMvcRequestBuilders.multipart("/users")
						.file(file)
						.param("name", "ime3")
						.param("lastname", "prezime3")
						.param("username", "korisnik3")
						.param("email", "ime.prezime3@gmail.com")
						.param("password", "lozinka3")
						.param("userType", "COMPETITION_LEADER"))

				.andExpect(status().isOk())
				.andReturn();
		MvcResult resultFromCreateUser2 = mockMvc.perform(MockMvcRequestBuilders.multipart("/users")
						.file(file)
						.param("name", "ime3")
						.param("lastname", "prezime3")
						.param("username", "korisnik3")
						.param("email", "ime.prezime4@gmail.com")
						.param("password", "lozinka3")
						.param("userType", "COMPETITION_LEADER"))
				.andReturn();
		ObjectMapper objectMapper = new ObjectMapper();

		//JsonNode jsonNode = objectMapper.readTree(resultFromCreateUser.getResponse().getContentAsString());
		//userRepository.deleteById(jsonNode.get("id").asLong());

		assertTrue(resultFromCreateUser2.getResponse().getStatus() == 400);

	}









}
