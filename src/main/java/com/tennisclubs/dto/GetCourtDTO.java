package com.tennisclubs.dto;

import com.tennisclubs.entity.SurfaceEnum;

public class GetCourtDTO {
    private Long courtId;
    private String name;
    private String clubName;
    private SurfaceEnum surface;

    public GetCourtDTO(Long courtId, String name, String clubName, SurfaceEnum surface) {
        this.courtId = courtId;
        this.name = name;
        this.clubName = clubName;
        this.surface = surface;
    }

    public Long getCourtId() { return courtId; }

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
