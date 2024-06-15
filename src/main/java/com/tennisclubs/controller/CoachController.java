package com.tennisclubs.controller;

import com.tennisclubs.dto.AddCoachDTO;
import com.tennisclubs.dto.AddTrainingDTO;
import com.tennisclubs.dto.GetCoachDTO;
import com.tennisclubs.dto.GetTrainingDTO;
import com.tennisclubs.service.CoachService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coaches")
public class CoachController {
    private final CoachService coachService;

    public CoachController(CoachService coachService) {
        this.coachService = coachService;
    }

    @GetMapping
    public List<GetCoachDTO> getAllCoaches() {
        return coachService.getAllCoaches();
    }

    @PostMapping
    public ResponseEntity<Object> addNewCoach(@ModelAttribute AddCoachDTO dto) {
        return coachService.addNewCoach(dto);
    }

    @GetMapping("/{coachId}")
    public GetCoachDTO seeCoachInfo(@PathVariable("coachId") Long coachId) {
        return coachService.seeCoachInfo(coachId);
    }

    @PutMapping("/{coachId}")
    public ResponseEntity<Object> changeCoachInfo(@PathVariable("coachId") Long coachId, @ModelAttribute AddCoachDTO dto) {
        return coachService.changeCoachInfo(coachId, dto);
    }

    @DeleteMapping("/{coachId}")
    public ResponseEntity<Object> deleteCoach(@PathVariable("coachId") Long coachId) {
        coachService.deleteCoach(coachId);
        return ResponseEntity.ok().body("Coach deleted successfully!");
    }

    // coach training sessions
    @GetMapping("/{coachId}/training-sessions")
    public List<GetTrainingDTO> getCoachTrainingSessions(@PathVariable("coachId") Long coachId) {
        return coachService.getCoachTrainingSessions(coachId);
    }

    @PostMapping("/{coachId}/training-sessions")
    public ResponseEntity<Object> addNewTrainingSession(@ModelAttribute AddTrainingDTO dto, @PathVariable("coachId") Long coachId) {
        return coachService.addNewTrainingSession(dto, coachId);
    }

    @GetMapping("/{coachId}/training-sessions/{trainingId}")
    public GetTrainingDTO seeTrainingSessionInfo(@PathVariable("trainingId") Long trainingId, @PathVariable("coachId") Long coachId) {
        return coachService.seeTrainingSessionInfo(trainingId, coachId);
    }

    @PutMapping("/{coachId}/training-sessions/{trainingId}")
    public ResponseEntity<Object> changeTrainingSessionInfo(@PathVariable("trainingId") Long trainingId, @ModelAttribute AddTrainingDTO dto, @PathVariable("coachId") Long coachId) {
        return coachService.changeTrainingSessionInfo(trainingId, dto, coachId);
    }

    @DeleteMapping("/{coachId}/training-sessions/{trainingId}")
    public ResponseEntity<Object> deleteTrainingSession(@PathVariable("trainingId") Long trainingId, @PathVariable("coachId") Long coachId) {
        coachService.deleteTrainingSession(trainingId, coachId);
        return ResponseEntity.ok().body("Training deleted successfully!");
    }


}
