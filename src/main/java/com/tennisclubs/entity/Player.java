package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "player")
@PrimaryKeyJoinColumn(name = "playerId")
public class Player extends Person {
    private Double height;
    private Double weight;
    private HandEnum preferredHand;

    @Column(unique = true)
    private Integer rank;

    @Size(max = 200)
    private String injury;

    @OneToMany(mappedBy = "player")
    private Set<Represents> clubsPlayedAt;

    @ManyToMany(mappedBy = "players")
    private Set<Training> attendedTrainingSessions;

    @OneToMany(mappedBy = "player1")
    private Set<Match> singlesMatchesPlayedAsHost;

    @OneToMany(mappedBy = "player2")
    private Set<Match> singlesMatchesPlayedAsGuest;

    public Player() {}

    public Player(String oib, String name, String surname, LocalDate dateOfBirth, SexEnum sex, Place place, Double height, Double weight, HandEnum preferredHand, Integer rank, String injury) {
        super(oib, name, surname, dateOfBirth, sex, place);
        this.height = height;
        this.weight = weight;
        this.preferredHand = preferredHand;
        this.rank = rank;
        this.injury = injury;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public HandEnum getPreferredHand() {
        return preferredHand;
    }

    public void setPreferredHand(HandEnum preferredHand) {
        this.preferredHand = preferredHand;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public String getInjury() {
        return injury;
    }

    public void setInjury(String injury) {
        this.injury = injury;
    }

    public Set<Represents> getClubsPlayedAt() {
        return clubsPlayedAt;
    }

    public void setClubsPlayedAt(Set<Represents> clubsPlayedAt) {
        this.clubsPlayedAt = clubsPlayedAt;
    }

    public Set<Training> getAttendedTrainingSessions() {
        return attendedTrainingSessions;
    }

    public void setAttendedTrainingSessions(Set<Training> attendedTrainingSessions) {
        this.attendedTrainingSessions = attendedTrainingSessions;
    }

    public Set<Match> getSinglesMatchesPlayedAsHost() {
        return singlesMatchesPlayedAsHost;
    }

    public void setSinglesMatchesPlayedAsHost(Set<Match> singlesMatchesPlayedAsHost) {
        this.singlesMatchesPlayedAsHost = singlesMatchesPlayedAsHost;
    }

    public Set<Match> getSinglesMatchesPlayedAsGuest() {
        return singlesMatchesPlayedAsGuest;
    }

    public void setSinglesMatchesPlayedAsGuest(Set<Match> singlesMatchesPlayedAsGuest) {
        this.singlesMatchesPlayedAsGuest = singlesMatchesPlayedAsGuest;
    }
}
