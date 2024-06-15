package com.tennisclubs.dto;

import com.tennisclubs.entity.CategoryTypeEnum;
import com.tennisclubs.entity.SexEnum;

public class GetTournamentDTO {
    private Long tournamentId;
    private String name;
    private String clubName;
    private CategoryTypeEnum type;
    private String ageLimit;
    private SexEnum sexLimit;

    public GetTournamentDTO(Long tournamentId, String name, String clubName, CategoryTypeEnum type, String ageLimit, SexEnum sexLimit) {
        this.tournamentId = tournamentId;
        this.name = name;
        this.clubName = clubName;
        this.type = type;
        this.ageLimit = ageLimit;
        this.sexLimit = sexLimit;
    }

    public Long getTournamentId() {
        return tournamentId;
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
