package com.tennisclubs.dto;

import com.tennisclubs.entity.SurfaceEnum;

public class AddCourtDTO {
    private String name;
    private Long clubId;
    private SurfaceEnum surface;

    public AddCourtDTO(String name, Long clubId, SurfaceEnum surface) {
        this.name = name;
        this.clubId = clubId;
        this.surface = surface;
    }

    public String getName() {
        return name;
    }

    public Long getClubId() {
        return clubId;
    }

    public SurfaceEnum getSurface() {
        return surface;
    }
}
