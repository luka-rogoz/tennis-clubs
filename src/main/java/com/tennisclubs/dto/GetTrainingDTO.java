package com.tennisclubs.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class GetTrainingDTO {
    private Long trainingId;
    private LocalDateTime trainingTimestamp;
    private String duration;
    private String description;
    private String notes;
    private String coach;
    private Set<String> players;

    public GetTrainingDTO(Long trainingId, LocalDateTime trainingTimestamp, String duration, String description, String notes, String coach, Set<String> players) {
        this.trainingTimestamp = trainingTimestamp;
        this.duration = duration;
        this.description = description;
        this.notes = notes;
        this.coach = coach;
        this.players = players;
    }

    public Long getTrainingId() {
        return trainingId;
    }

    public LocalDateTime getTrainingTimestamp() {
        return trainingTimestamp;
    }

    public String getDuration() {
        return duration;
    }

    public String getDescription() {
        return description;
    }

    public String getNotes() {
        return notes;
    }

    public String getCoach() {
        return coach;
    }

    public Set<String> getPlayers() {
        return players;
    }
}
