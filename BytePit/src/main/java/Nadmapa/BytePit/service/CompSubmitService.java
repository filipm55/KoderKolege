package Nadmapa.BytePit.service;

import Nadmapa.BytePit.domain.CompRank;
import Nadmapa.BytePit.dto.VirtualCompRankDTO;

import java.util.List;

public interface CompSubmitService {
    CompRank calculateAndSaveCompRank(Long competitionId, String username);

    List<VirtualCompRankDTO> calculateRank(Long competitionId, String username);

    List<VirtualCompRankDTO> virtualRandRank(Long competitionId, String username);
}