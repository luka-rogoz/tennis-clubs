package com.tennisclubs.dto;

import com.tennisclubs.entity.HandEnum;
import com.tennisclubs.entity.SexEnum;

import java.time.LocalDate;
import java.util.Set;

public class GetPlayerDTO {
    private Long playerId;
    private String oib;
    private String name;
    private String surname;
    private LocalDate dateOfBirth;
    private SexEnum sex;
    private Integer zipCode;
    private String placeName;
    private Double height;
    private Double weight;
    private HandEnum preferredHand;
    private Integer rank;
    private String injury;
    private String clubName;
    private Set<String> previousClubs;

    public GetPlayerDTO(Long playerId, String oib, String name, String surname, LocalDate dateOfBirth, SexEnum sex, Integer zipCode, String placeName, Double height, Double weight, HandEnum preferredHand, Integer rank, String injury, String clubName, Set<String> previousClubs) {
        this.playerId = playerId;
        this.oib = oib;
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.sex = sex;
        this.zipCode = zipCode;
        this.placeName = placeName;
        this.height = height;
        this.weight = weight;
        this.preferredHand = preferredHand;
        this.rank = rank;
        this.injury = injury;
        this.clubName = clubName;
        this.previousClubs = previousClubs;
    }

    public Long getPlayerId() { return playerId; }

    public String getOib() {
        return oib;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public SexEnum getSex() {
        return sex;
    }

    public Integer getZipCode() {
        return zipCode;
    }

    public String getPlaceName() {
        return placeName;
    }

    public Double getHeight() {
        return height;
    }

    public Double getWeight() {
        return weight;
    }

    public HandEnum getPreferredHand() {
        return preferredHand;
    }

    public Integer getRank() {
        return rank;
    }

    public String getInjury() {
        return injury;
    }

    public String getClubName() { return clubName; }

    public Set<String> getPreviousClubs() { return previousClubs; }
}
