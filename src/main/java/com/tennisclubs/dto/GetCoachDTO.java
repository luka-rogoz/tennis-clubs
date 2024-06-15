package com.tennisclubs.dto;

import com.tennisclubs.entity.SexEnum;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

public class GetCoachDTO {
    private Long coachId;
    private String oib;
    private String name;
    private String surname;
    private LocalDate dateOfBirth;
    private SexEnum sex;
    private Integer zipCode;
    private String placeName;
    private Integer yearsOfExperience;
    private String specialization;
    private String clubName;
    private Set<String> previousClubs;

    public GetCoachDTO(Long coachId, String oib, String name, String surname, LocalDate dateOfBirth, SexEnum sex, Integer zipCode, String placeName, Integer yearsOfExperience, String specialization, String clubName, Set<String> previousClubs) {
        this.coachId = coachId;
        this.oib = oib;
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.sex = sex;
        this.zipCode = zipCode;
        this.placeName = placeName;
        this.yearsOfExperience = yearsOfExperience;
        this.specialization = specialization;
        this.clubName = clubName;
        this.previousClubs = previousClubs;
    }

    public Long getCoachId() { return coachId; }

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

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getClubName() { return clubName; }

    public Set<String> getPreviousClubs() { return previousClubs; }
}
