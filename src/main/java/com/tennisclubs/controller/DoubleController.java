package com.tennisclubs.controller;

import com.tennisclubs.dto.AddDoubleDTO;
import com.tennisclubs.dto.GetDoubleDTO;
import com.tennisclubs.dto.GetMatchDTO;
import com.tennisclubs.entity.Match;
import com.tennisclubs.service.DoubleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doubles")
public class DoubleController {
    private final DoubleService doubleService;

    public DoubleController(DoubleService doubleService) {
        this.doubleService = doubleService;
    }

    @GetMapping
    public List<GetDoubleDTO> getAllDoubles() {
        return doubleService.getAllDoubles();
    }

    @PostMapping
    public ResponseEntity<Object> addNewDouble(@ModelAttribute AddDoubleDTO dto) {
        return doubleService.addNewDouble(dto);
    }

    @GetMapping("/{pairId}")
    public GetDoubleDTO seeDoubleInfo(@PathVariable("pairId") Long pairId) {
        return doubleService.seeDoubleInfo(pairId);
    }

    @PutMapping("/{pairId}")
    public ResponseEntity<Object> changeDoubleInfo(@PathVariable("pairId") Long pairId, @ModelAttribute AddDoubleDTO dto) {
        return doubleService.changeDoubleInfo(pairId, dto);
    }

    @DeleteMapping("/{pairId}")
    public ResponseEntity<Object> deleteDouble(@PathVariable("pairId") Long pairId) {
        doubleService.deleteDouble(pairId);
        return ResponseEntity.ok().body("Double deleted successfully!");
    }

    // doubles matches
    @GetMapping("/{pairId}/doubles-matches")
    public List<GetMatchDTO> getAllDoubleMatches(@PathVariable("pairId") Long pairId) {
        return doubleService.getAllDoubleMatches(pairId);
    }
}
