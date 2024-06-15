package com.tennisclubs.dto;

import com.tennisclubs.entity.CategoryTypeEnum;
import com.tennisclubs.entity.SexEnum;

public class AddTournamentDTO {
    private String name;
    private String clubName;
    private CategoryTypeEnum type;
    private String ageLimit;
    private SexEnum sexLimit;

    public AddTournamentDTO(String name, String clubName, CategoryTypeEnum type, String ageLimit, SexEnum sexLimit) {
        this.name = name;
        this.clubName = clubName;
        this.type = type;
        this.ageLimit = ageLimit;
        this.sexLimit = sexLimit;
    }

    public String getName() {
        return name;
    }

    public String getClubName() {
        return clubName;
    }

    public CategoryTypeEnum getType() {
        return type;
    }

    public String getAgeLimit() {
        return ageLimit;
    }

    public SexEnum getSexLimit() {
        return sexLimit;
    }
}
