package Nadmapa.BytePit.service.impl;

import Nadmapa.BytePit.domain.Competition;
import Nadmapa.BytePit.domain.Problem;
import Nadmapa.BytePit.domain.User;
import Nadmapa.BytePit.repository.CompRankRepository;
import Nadmapa.BytePit.repository.CompetitionRepository;
import Nadmapa.BytePit.repository.ProblemRepository;
import Nadmapa.BytePit.repository.UserRepository;
import Nadmapa.BytePit.service.CompetitionService;
import Nadmapa.BytePit.service.ProblemService;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class CompetitionServiceJpa implements CompetitionService {
    @Autowired
    private CompetitionRepository competitionRepo;
    @Autowired
    ProblemRepository problemRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private CompRankRepository compRankRepository;
    @Override
    public List<Competition> listAll() {
        return competitionRepo.findAll();
    }

    @Override
    public ResponseEntity<String> createCompetition(Competition competition) {
        Competition competition1 = competitionRepo.save(competition);
        return ResponseEntity.ok("Uspjesno stvoreno natjecanje s id-om:  " + competition1.getId() + "\n" +
                "Competiton maker je : " + competition1.getCompetitionMaker().getUsername());
    }

    public Competition getCompetition(String competitionId) {
        return competitionRepo.findById(competitionId)
                .orElseThrow(() -> new EntityNotFoundException("Competition not found"));
    }

    @Override
    public void saveCompetition(Competition competition) {
        competitionRepo.save(competition);
    }

    @Override
    public void deleteCompetitionById(Long id) {
        competitionRepo.deleteById(id.toString());
    }

    @Override
    public void krajNatjecanja(Long competitionId, LocalDateTime dateTimeOfEnding) {

        Optional<Competition> competitionOptional = competitionRepo.findById(String.valueOf(competitionId));
        if(competitionOptional.isPresent()){

            Competition competition = competitionOptional.get();
            if(competition.getDateTimeOfEnding().isEqual(dateTimeOfEnding)){
                System.out.println("Kraj natjecanja: " + competitionId);
                if(competition.getName().equals("Virtualno")) {
                    competitionRepo.deleteById(String.valueOf(competitionId));
                    return;
                }
                competition.setIsvirtual(true);

                Set<Problem> problems = competition.getProblems();
                for (Problem problem: problems) {
                    problem.setIsPrivate(false);
                    problemRepository.save(problem);
                }
                competitionRepo.save(competition);

                List<Object[]> objects = compRankRepository.getCompetitionRanking(competitionId);
                Integer rank = Integer.valueOf(1);
                for (Object[] objectArray: objects) {
                    try{
                        Long userId = (Long) objectArray[0];
                        //Integer rank = (Integer) objectArray[3];


                        Optional<User> userOptional = userRepository.findById(userId);
                        if(userOptional.isPresent()){
                            User user = userOptional.get();
                            Map<Competition, Integer> mapa = user.getCompetitionPlacements();
                            mapa.put(competition, rank);
                            user.setCompetitionPlacements(mapa);
                            userRepository.save(user);
                        }
                        else{
                            System.out.println("GRESKA KOD DAVANJA NAGRADA");
                        }
                    }catch (Exception ignorable){
                        System.out.println("GRESKA NEKA PRI DAVANJU NAGRADA");
                    }
                    rank++;
                }

            }
            else System.out.println("Probao sam zavrsiti natjecanje " + competitionId + ", ali mu je promijenjeno vrijeme kraja: " + dateTimeOfEnding + " -> " + competition.getDateTimeOfEnding());

        }
    }

}
