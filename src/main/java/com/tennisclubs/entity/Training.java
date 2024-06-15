package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "training")
public class Training {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainingId;

    private LocalDateTime trainingTimestamp;
    private String duration;

    @Size(max = 200)
    private String description;

    @Size(max = 500)
    private String notes;

    @ManyToMany
    @JoinTable(
            name = "trains",
            joinColumns = @JoinColumn(name = "training_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id"))
    private Set<Player> players;

    @ManyToOne
    @JoinColumn(name = "coach_id")
    private Coach coach;

    public Training() {}

    public Training(LocalDateTime trainingTimestamp, String duration, String description, String notes, Set<Player> players, Coach coach) {
        this.trainingTimestamp = trainingTimestamp;
        this.duration = duration;
        this.description = description;
        this.notes = notes;
        this.players = players;
        this.coach = coach;
    }

    public Long getTrainingId() {
        return trainingId;
    }

    public void setTrainingId(Long trainingId) {
        this.trainingId = trainingId;
    }

    public LocalDateTime getTrainingTimestamp() {
        return trainingTimestamp;
    }

    public void setTrainingTimestamp(LocalDateTime trainingTimestamp) {
        this.trainingTimestamp = trainingTimestamp;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Set<Player> getPlayers() {
        return players;
    }

    public void setPlayers(Set<Player> players) {
        this.players = players;
    }

    public Coach getCoach() {
        return coach;
    }

    public void setCoach(Coach coach) {
        this.coach = coach;
    }
}
