package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "coach")
@PrimaryKeyJoinColumn(name = "coach_id")
public class Coach extends Person {
    private Integer yearsOfExperience;

    @Size(max = 100)
    private String specialization;

    @OneToMany(mappedBy = "coach")
    private Set<HoldsTrainingSessions> clubsCoachedAt;

    @OneToMany(mappedBy = "coach")
    private Set<Training> heldTrainingSessions;

    public Coach() {}

    public Coach(String oib, String name, String surname, LocalDate dateOfBirth, SexEnum sex, Place place, Integer yearsOfExperience, String specialization) {
        super(oib, name, surname, dateOfBirth, sex, place);
        this.yearsOfExperience = yearsOfExperience;
        this.specialization = specialization;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Set<HoldsTrainingSessions> getClubsCoachedAt() {
        return clubsCoachedAt;
    }

    public void setClubsCoachedAt(Set<HoldsTrainingSessions> clubsCoachedAt) {
        this.clubsCoachedAt = clubsCoachedAt;
    }

    public Set<Training> getHeldTrainingSessions() {
        return heldTrainingSessions;
    }

    public void setHeldTrainingSessions(Set<Training> heldTrainingSessions) {
        this.heldTrainingSessions = heldTrainingSessions;
    }
}
