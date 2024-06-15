package com.tennisclubs.dto;

import com.tennisclubs.entity.SurfaceEnum;

public class AddCourtDTO {
    private String name;
    private String clubName;
    private SurfaceEnum surface;

    public AddCourtDTO(String name, String clubName, SurfaceEnum surface) {
        this.name = name;
        this.clubName = clubName;
        this.surface = surface;
    }

    public String getName() {
        return name;
    }

    public String getClubName() {
        return clubName;
    }

    public SurfaceEnum getSurface() {
        return surface;
    }
}
