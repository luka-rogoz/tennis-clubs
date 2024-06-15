package com.tennisclubs.controller;

import com.tennisclubs.dto.AddMatchDTO;
import com.tennisclubs.dto.AddTournamentDTO;
import com.tennisclubs.dto.GetMatchDTO;
import com.tennisclubs.dto.GetTournamentDTO;
import com.tennisclubs.entity.Match;
import com.tennisclubs.service.TournamentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tournaments")
public class TournamentController {
    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @GetMapping
    public List<GetTournamentDTO> getAllTournaments() {
        return tournamentService.getAllTournaments();
    }

    @PostMapping
    public ResponseEntity<Object> addNewTournament(@ModelAttribute AddTournamentDTO dto) {
        return tournamentService.addNewTournament(dto);
    }

    @GetMapping("/{tournamentId}")
    public GetTournamentDTO seeTournamentInfo(@PathVariable("tournamentId") Long tournamentId) {
        return tournamentService.seeTournamentInfo(tournamentId);
    }

    @PutMapping("/{tournamentId}")
    public ResponseEntity<Object> changeTournamentInfo(@PathVariable("tournamentId") Long tournamentId, @ModelAttribute AddTournamentDTO dto) {
        return tournamentService.changeTournamentInfo(tournamentId, dto);
    }

    @DeleteMapping("/{tournamentId}")
    public ResponseEntity<Object> deleteTournament(@PathVariable("tournamentId") Long tournamentId) {
        tournamentService.deleteTournament(tournamentId);
        return ResponseEntity.ok().body("Tournament deleted successfully!");
    }

    // tournament matches
    @GetMapping("/{tournamentId}/matches")
    public List<GetMatchDTO> getAllTournamentMatches(@PathVariable("tournamentId") Long tournamentId) {
        return tournamentService.getAllTournamentMatches(tournamentId);
    }

    @PostMapping("/{tournamentId}/matches")
    public ResponseEntity<Object> addNewTournamentMatch(@PathVariable("tournamentId") Long tournamentId, @ModelAttribute AddMatchDTO dto) {
        return tournamentService.addNewTournamentMatch(dto, tournamentId);
    }

    @GetMapping("/{tournamentId}/matches/{matchId}")
    public GetMatchDTO seeTournamentMatchInfo(@PathVariable("matchId") Long matchId, @PathVariable("tournamentId") Long tournamentId) {
        return tournamentService.seeTournamentMatchInfo(matchId, tournamentId);
    }

    @PutMapping("/{tournamentId}/matches/{matchId}")
    public ResponseEntity<Object> changeTournamentMatchInfo(@PathVariable("matchId") Long matchId, @PathVariable("tournamentId") Long tournamentId, @ModelAttribute AddMatchDTO dto) {
        return tournamentService.changeTournamentMatchInfo(matchId, tournamentId, dto);
    }

    @DeleteMapping("/{tournamentId}/matches/{matchId}")
    public ResponseEntity<Object> deleteTournamentMatch(@PathVariable("matchId") Long matchId, @PathVariable("tournamentId") Long tournamentId) {
        tournamentService.deleteTournamentMatch(matchId, tournamentId);
        return ResponseEntity.ok().body("Match deleted successfully!");
    }
}
