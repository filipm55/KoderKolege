package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.CompRank;

public interface CompSubmitService {
    CompRank calculateAndSaveCompRank(Long competitionId, String username);
}