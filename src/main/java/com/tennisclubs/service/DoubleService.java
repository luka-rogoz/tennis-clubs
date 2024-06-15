package com.tennisclubs.service;

import com.tennisclubs.dao.MatchRepository;
import com.tennisclubs.dao.PairRepository;
import com.tennisclubs.dao.PlayerRepository;
import com.tennisclubs.dto.AddDoubleDTO;
import com.tennisclubs.dto.GetDoubleDTO;
import com.tennisclubs.dto.GetMatchDTO;
import com.tennisclubs.entity.Match;
import com.tennisclubs.entity.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Stream;

@Service
public class DoubleService {
    private final PairRepository pairRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;

    public DoubleService(PairRepository pairRepository, MatchRepository matchRepository, PlayerRepository playerRepository) {
        this.pairRepository = pairRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
    }

    public List<GetDoubleDTO> getAllDoubles() {
        return pairRepository.findAll().stream().
                map(pair -> new GetDoubleDTO(pair.getPairId(), pair.getPlayer1().getOib(), pair.getPlayer1().getName(),
                        pair.getPlayer1().getSurname(), pair.getPlayer2().getOib(), pair.getPlayer2().getName(),
                        pair.getPlayer2().getSurname(), pair.getRank())).toList();
    }

    public ResponseEntity<Object> addNewDouble(AddDoubleDTO dto) {
        Pair newDouble = new Pair(playerRepository.findByOib(dto.getPlayer1oib()).orElseThrow(),
                playerRepository.findByOib(dto.getPlayer2oib()).orElseThrow(), dto.getRank());
        pairRepository.save(newDouble);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/doubles/" + newDouble.getPairId()).body("Double added successfully!");
    }

    public GetDoubleDTO seeDoubleInfo(Long pairId) {
        Pair pair = pairRepository.findByPairId(pairId).orElseThrow();
        return new GetDoubleDTO(pair.getPairId(), pair.getPlayer1().getOib(), pair.getPlayer1().getName(),
                pair.getPlayer1().getSurname(), pair.getPlayer2().getOib(), pair.getPlayer2().getName(),
                pair.getPlayer2().getSurname(), pair.getRank());
    }

    public ResponseEntity<Object> changeDoubleInfo(Long pairId, AddDoubleDTO dto) {
        if (!pairRepository.existsByPairId(pairId)) {
            throw new NoSuchElementException();
        }

        Pair changedDouble = pairRepository.findByPairId(pairId).orElseThrow();
        changedDouble.setPlayer1(playerRepository.findByOib(dto.getPlayer1oib()).orElseThrow());
        changedDouble.setPlayer2(playerRepository.findByOib(dto.getPlayer2oib()).orElseThrow());
        changedDouble.setRank(dto.getRank());
        pairRepository.save(changedDouble);

        return ResponseEntity.ok().body("Double info changed successfully!");
    }

    public void deleteDouble(Long pairId) {
        Pair pair = pairRepository.findByPairId(pairId).orElseThrow();
        List<Match> matches = Stream.concat(matchRepository.findByPair1(pair).stream(),
                matchRepository.findByPair2(pair).stream()).toList();
        matchRepository.deleteAll(matches);
        pairRepository.delete(pair);
    }

    public List<GetMatchDTO> getAllDoubleMatches(Long pairId) {
        return Stream.concat(pairRepository.findByPairId(pairId).orElseThrow().getDoublesMatchesPlayedAsHosts().
                stream(), pairRepository.findByPairId(pairId).orElseThrow().getDoublesMatchesPlayedAsGuests().
                stream()).map(m -> new GetMatchDTO(m.getMatchId(), m.getMatchTimestamp(), m.getMatchResult(),
                m.getDuration(), m.getStage(), m.getPair1().getPlayer1().getSurname() + "-" + m.getPair1()
                .getPlayer2().getSurname() + ", " + m.getPair1().getPairId(), m.getPair2().getPlayer1().getSurname() + "-" + m.getPair2()
                .getPlayer2().getSurname() + ", " + m.getPair2().getPairId(), m.getCourt().getName(), m.getTournament().getName(), m.getTournament().getCategory().getType())).toList();
    }
}
