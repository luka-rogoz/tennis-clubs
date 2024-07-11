package com.tennisclubs.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class AddTrainingDTO {
    private LocalDateTime trainingTimestamp;
    private String duration;
    private String description;
    private String notes;
    private Long coachId;
    private Set<String> players;

    public AddTrainingDTO(LocalDateTime trainingTimestamp, String duration, String description, String notes, Long coachId, Set<String> players) {
        this.trainingTimestamp = trainingTimestamp;
        this.duration = duration;
        this.description = description;
        this.notes = notes;
        this.coachId = coachId;
        this.players = players;
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

    public Long getCoachId() {
        return coachId;
    }

    public Set<String> getPlayers() {
        return players;
    }
}
