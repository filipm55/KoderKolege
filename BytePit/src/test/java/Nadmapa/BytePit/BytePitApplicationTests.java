package Nadmapa.BytePit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import Nadmapa.BytePit.domain.*;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.rest.UserController;
import Nadmapa.BytePit.service.UserService;
import Nadmapa.BytePit.service.impl.UserRegistrationService;
import Nadmapa.BytePit.service.impl.UserServiceJpa;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@SpringBootTest @ExtendWith(MockitoExtension.class) @AutoConfigureMockMvc
class BytePitApplicationTests {
	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private UserController userController;

	private MockMvc mockMvc;
	 /* @BeforeEach
	void setup(){
		userRepository= new
		user = new User("korisnik1", "ime", "prezime", "lozinka", "ime.prezime@gmail.com", null, "COMPETITOR");
		userService = new UserServiceJpa();
		userService.saveUser(user);
	}*/

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

	@Test
	void competitionProblems(){
		//String problemMakerId, String title, int points, String duration, String text,Map<String, String> inputOutputExamples, Boolean isPrivate, ProblemType problemType
		Map<String,String> mapa = new HashMap<>();
		mapa.put("ulaz", "izlaz");

		Problem problem = new Problem("1", "naslov", 5, "10:00", "text" , mapa, false, ProblemType.HARD);
		//(User competitionMaker, LocalDateTime dateTimeOfBeginning, LocalDateTime dateTimeOfEnding, Set<Problem> problems, Image trophyPicture, boolean slicica_pehara, Boolean isvirtual
		User user = new User("korisnik1", "ime", "prezime", "lozinka", "ime.prezime@gmail.com", null, "COMPETITION_LEADER");
		Set<Problem> set = new HashSet<>();
		set.add(problem);
		Competition competition = new Competition(user, LocalDateTime.now(), LocalDateTime.now(), set, null, false, false);
		assertEquals(set, competition.getProblems());
	}

	/*
	@Test
	void testGetUserById() throws Exception {
		// Id koji ćete koristiti u testu
		Long userId = 1L;

		// Mock User objekt koji će se koristiti kao rezultat
		User mockUser = new User();
		mockUser.setId(userId);
		mockUser.setUsername("testUser");

		// Postavljanje ponašanja mock repositoryja
		when(userRepository.findById(userId)).thenReturn(java.util.Optional.ofNullable(mockUser));

		// Testiranje HTTP GET zahtjeva
		mockMvc.perform(get("/api/users/{id}", userId)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").value(userId.intValue()))
				.andExpect(jsonPath("$.username").value("testUser"))
				.andExpect(result -> {
					User returnedUser = new ObjectMapper().readValue(result.getResponse().getContentAsString(), User.class);
					assertNotNull(returnedUser);
					assertEquals(userId, returnedUser.getId());
					assertEquals("testUser", returnedUser.getUsername());
				});
	}*/

}
