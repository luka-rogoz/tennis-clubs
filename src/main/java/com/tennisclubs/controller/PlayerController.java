package com.tennisclubs.controller;

import com.tennisclubs.dto.AddPlayerDTO;
import com.tennisclubs.dto.GetMatchDTO;
import com.tennisclubs.dto.GetPlayerDTO;
import com.tennisclubs.entity.Match;
import com.tennisclubs.service.PlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public List<GetPlayerDTO> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @PostMapping
    public ResponseEntity<Object> addNewPlayer(@ModelAttribute AddPlayerDTO dto) { return playerService.addNewPlayer(dto); }

    @GetMapping("/{playerId}")
    public GetPlayerDTO seePlayerInfo(@PathVariable("playerId") Long playerId) {
        return playerService.seePlayerInfo(playerId);
    }

    @PutMapping("/{playerId}")
    public ResponseEntity<Object> changePlayerInfo(@PathVariable("playerId") Long playerId, @ModelAttribute AddPlayerDTO dto) {
        return playerService.changePlayerInfo(playerId, dto);
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<Object> deletePlayer(@PathVariable("playerId") Long playerId) {
        playerService.deletePlayer(playerId);
        return ResponseEntity.ok().body("Player deleted successfully!");
    }

    // player singles matches
    @GetMapping("/{playerId}/singles-matches")
    public List<GetMatchDTO> getPlayerMatches(@PathVariable("playerId") Long playerId) {
        return playerService.getPlayerMatches(playerId); }

}
