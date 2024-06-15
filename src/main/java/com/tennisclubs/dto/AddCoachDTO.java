package com.tennisclubs.dto;

import com.tennisclubs.entity.SexEnum;

import java.time.LocalDate;
import java.util.Date;

public class AddCoachDTO {
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
    private LocalDate from;

    public AddCoachDTO(String oib, String name, String surname, LocalDate dateOfBirth, SexEnum sex, Integer zipCode, String placeName, Integer yearsOfExperience, String specialization, String clubName, LocalDate from) {
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
        this.from = from;
    }

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
    public LocalDate getFrom() { return from; }
}
