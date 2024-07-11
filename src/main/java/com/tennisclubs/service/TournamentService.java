package com.tennisclubs.service;

import com.tennisclubs.dao.*;
import com.tennisclubs.dto.AddMatchDTO;
import com.tennisclubs.dto.AddTournamentDTO;
import com.tennisclubs.dto.GetMatchDTO;
import com.tennisclubs.dto.GetTournamentDTO;
import com.tennisclubs.entity.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TournamentService {
    private final TournamentRepository tournamentRepository;
    private final ClubRepository clubRepository;
    private final CategoryRepository categoryRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private final PairRepository pairRepository;
    private final CourtRepository courtRepository;

    public TournamentService(TournamentRepository tournamentRepository, ClubRepository clubRepository, CategoryRepository categoryRepository, MatchRepository matchRepository, PlayerRepository playerRepository, PairRepository pairRepository, CourtRepository courtRepository) {
        this.tournamentRepository = tournamentRepository;
        this.clubRepository = clubRepository;
        this.categoryRepository = categoryRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
        this.pairRepository = pairRepository;
        this.courtRepository = courtRepository;
    }

    public List<GetTournamentDTO> getAllTournaments() {
        return tournamentRepository.findAll().stream().
                map(tournament -> new GetTournamentDTO(tournament.getTournamentId(), tournament.getName(),
                        tournament.getClub().getName(), tournament.getCategory().getType(), tournament.getCategory().getAgeLimit(),
                        tournament.getCategory().getSexLimit())).toList();
    }

    public ResponseEntity<Object> addNewTournament(AddTournamentDTO dto) {
        Category category;
        List<Category> categories = new ArrayList<>(categoryRepository.findAll().stream().
                filter(cat -> cat.getType().equals(dto.getType()) &&
                        cat.getAgeLimit().equals(dto.getAgeLimit()) &&
                        cat.getSexLimit().equals(dto.getSexLimit())).toList());
        if (categories.isEmpty()) {
            category = new Category(dto.getType(), dto.getAgeLimit(), dto.getSexLimit());
            categoryRepository.save(category);
        } else {
            category = categories.getFirst();
        }
        Tournament newTournament = new Tournament(dto.getName(), clubRepository.findByName(dto.getClubName()).orElseThrow(),
                category);
        tournamentRepository.save(newTournament);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/tournaments/" + newTournament.getTournamentId()).body("Tournament added successfully!");
    }

    public GetTournamentDTO seeTournamentInfo(Long tournamentId) {
        Tournament tournament = tournamentRepository.findByTournamentId(tournamentId).orElseThrow();
        return new GetTournamentDTO(tournament.getTournamentId(), tournament.getName(), tournament.getClub().getName(),
                tournament.getCategory().getType(), tournament.getCategory().getAgeLimit(),
                tournament.getCategory().getSexLimit());
    }

    public ResponseEntity<Object> changeTournamentInfo(Long tournamentId, AddTournamentDTO dto) {
        if (!tournamentRepository.existsByTournamentId(tournamentId)) {
            throw new NoSuchElementException();
        }

        List<Category> category = new ArrayList<>(categoryRepository.findAll().stream().
                filter(cat -> cat.getType().equals(dto.getType()) &&
                        cat.getAgeLimit().equals(dto.getAgeLimit()) &&
                        cat.getSexLimit().equals(dto.getSexLimit())).toList());
        if (category.isEmpty()) {
            category.add(new Category(dto.getType(), dto.getAgeLimit(), dto.getSexLimit()));
            categoryRepository.save(new Category(dto.getType(), dto.getAgeLimit(), dto.getSexLimit()));
        }

        Tournament changedTournament = tournamentRepository.findByTournamentId(tournamentId).orElseThrow();
        changedTournament.setName(dto.getName());
        changedTournament.setClub(clubRepository.findByName(dto.getClubName()).orElseThrow());
        changedTournament.setCategory(category.getFirst());
        tournamentRepository.save(changedTournament);

        return ResponseEntity.ok().body("Tournament info changed successfully!");
    }

    public void deleteTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findByTournamentId(tournamentId).orElseThrow();
        List<Match> matches = matchRepository.findAll().stream().
                filter(match -> match.getTournament().getTournamentId().equals(tournamentId)).toList();
        matchRepository.deleteAll(matches);
        tournamentRepository.delete(tournament);
        if (!tournamentRepository.existsByCategory(tournament.getCategory())) {
            categoryRepository.delete(tournament.getCategory());
        }
    }

    // matches
    public List<GetMatchDTO> getAllTournamentMatches(Long tournamentId) {
        CategoryTypeEnum type = tournamentRepository.findByTournamentId(tournamentId).orElseThrow().getCategory().getType();
        return switch (type) {
            case CategoryTypeEnum.SINGLES ->
                    matchRepository.findAll().stream().filter(match -> match.getTournament().getTournamentId().
                            equals(tournamentId)).map(m -> new GetMatchDTO(m.getMatchId(), m.getMatchTimestamp(),
                            m.getMatchResult(), m.getDuration(), m.getStage(), m.getPlayer1().getName() + " "
                            + m.getPlayer1().getSurname() + ", " + m.getPlayer1().getOib(), m.getPlayer2().getName() + " "
                            + m.getPlayer2().getSurname() + ", " + m.getPlayer2().getOib(), m.getCourt().getName(),
                            m.getTournament().getName(), m.getTournament().getCategory().getType())).toList();
            case CategoryTypeEnum.DOUBLES ->
                    matchRepository.findAll().stream().filter(match -> match.getTournament().getTournamentId().
                            equals(tournamentId)).map(m -> new GetMatchDTO(m.getMatchId(), m.getMatchTimestamp(),
                            m.getMatchResult(), m.getDuration(), m.getStage(), m.getPair1().getPlayer1().getSurname() + "-"
                            + m.getPair1().getPlayer2().getSurname() + ", " + m.getPair1().getPairId(), m.getPair2().getPlayer1().getSurname() + "-" +
                            m.getPair2().getPlayer2().getSurname() + ", " + m.getPair2().getPairId(), m.getCourt().getName(), m.getTournament().getName(),
                            m.getTournament().getCategory().getType())).toList();
        };
    }

    public ResponseEntity<Object> addNewTournamentMatch(AddMatchDTO dto, Long tournamentId) {
        CategoryTypeEnum type = tournamentRepository.findByTournamentId(dto.getTournamentId()).orElseThrow().getCategory().getType();
        Club club = tournamentRepository.findByTournamentId(dto.getTournamentId()).orElseThrow().getClub();
        Match newMatch = switch (type) {
            case CategoryTypeEnum.SINGLES ->
                    new Match(dto.getMatchTimestamp(), dto.getMatchResult(), dto.getDuration(), dto.getStage(),
                            playerRepository.findByOib(dto.getOpponent1()).orElseThrow(),
                            playerRepository.findByOib(dto.getOpponent2()).orElseThrow(),
                            null, null, courtRepository.findAll().stream().filter(c -> c.getClub().equals(club) &&
                            c.getName().equals(dto.getCourtName())).findFirst().get(), tournamentRepository.findByTournamentId(dto.getTournamentId()).orElseThrow());
            case CategoryTypeEnum.DOUBLES ->
                    new Match(dto.getMatchTimestamp(), dto.getMatchResult(), dto.getDuration(), dto.getStage(),
                            null, null, pairRepository.findByPairId(Long.valueOf(dto.getOpponent1())).orElseThrow(),
                            pairRepository.findByPairId(Long.valueOf(dto.getOpponent2())).orElseThrow(),
                            courtRepository.findAll().stream().filter(c -> c.getClub().equals(club) &&
                                    c.getName().equals(dto.getCourtName())).findFirst().get(), tournamentRepository.findByTournamentId(dto.getTournamentId()).orElseThrow());
        };
        matchRepository.save(newMatch);

        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/tournaments/" + tournamentId + "/matches/" + newMatch.getMatchId()).body("Match added successfully!");
    }

    public GetMatchDTO seeTournamentMatchInfo(Long matchId, Long tournamentId) {
        Match m = matchRepository.findByMatchId(matchId).orElseThrow();
        CategoryTypeEnum type = tournamentRepository.findByTournamentId(tournamentId).orElseThrow().getCategory().getType();
        return switch (type) {
            case CategoryTypeEnum.SINGLES ->
                    new GetMatchDTO(m.getMatchId(), m.getMatchTimestamp(), m.getMatchResult(), m.getDuration(),
                            m.getStage(), m.getPlayer1().getName() + " " + m.getPlayer1().getSurname() + ", " + m.getPlayer1().getOib(), m.getPlayer2().getName() + " "
                            + m.getPlayer2().getSurname() + ", " + m.getPlayer2().getOib(), m.getCourt().getName(),
                            m.getTournament().getName(), m.getTournament().getCategory().getType());
            case CategoryTypeEnum.DOUBLES ->
                    new GetMatchDTO(m.getMatchId(), m.getMatchTimestamp(), m.getMatchResult(), m.getDuration(),
                            m.getStage(), m.getPair1().getPlayer1().getSurname() + "-"
                            + m.getPair1().getPlayer2().getSurname() + ", " + m.getPair1().getPairId(), m.getPair2().getPlayer1().getSurname() + "-" +
                            m.getPair2().getPlayer2().getSurname() + ", " + m.getPair2().getPairId(), m.getCourt().getName(), m.getTournament().getName(),
                            m.getTournament().getCategory().getType());
        };
    }

    public ResponseEntity<Object> changeTournamentMatchInfo(Long matchId, Long tournamentId, AddMatchDTO dto) {
        if (!matchRepository.existsByMatchId(matchId)) {
            throw new NoSuchElementException();
        }

        CategoryTypeEnum type = tournamentRepository.findByTournamentId(dto.getTournamentId()).orElseThrow().getCategory().getType();
        Club club = tournamentRepository.findByTournamentId(dto.getTournamentId()).orElseThrow().getClub();
        Match changedMatch = matchRepository.findByMatchId(matchId).orElseThrow();
        changedMatch.setMatchResult(dto.getMatchResult());
        changedMatch.setMatchTimestamp(dto.getMatchTimestamp());
        changedMatch.setTournament(tournamentRepository.findByTournamentId(dto.getTournamentId()).orElseThrow());
        changedMatch.setDuration(dto.getDuration());
        changedMatch.setCourt(courtRepository.findAll().stream().filter(c -> c.getClub().equals(club) &&
                c.getName().equals(dto.getCourtName())).findFirst().get());
        changedMatch.setStage(dto.getStage());

        switch (type) {
            case CategoryTypeEnum.SINGLES:
                changedMatch.setPlayer1(playerRepository.findByOib(dto.getOpponent1()).orElseThrow());
                changedMatch.setPlayer2(playerRepository.findByOib(dto.getOpponent2()).orElseThrow());
                break;
            case CategoryTypeEnum.DOUBLES:
                changedMatch.setPair1(pairRepository.findByPairId(Long.valueOf(dto.getOpponent1())).orElseThrow());
                changedMatch.setPair2(pairRepository.findByPairId(Long.valueOf(dto.getOpponent2())).orElseThrow());
                break;
        }
        matchRepository.save(changedMatch);

        return ResponseEntity.ok().body("Match info changed successfully!");
    }

    public void deleteTournamentMatch(Long matchId, Long tournamentId) {
        Match match = matchRepository.findByMatchId(matchId).orElseThrow();
        matchRepository.delete(match);
    }
}
