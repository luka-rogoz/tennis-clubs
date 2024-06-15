package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "court")
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courtId;

    @Size(max = 30)
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @Enumerated(EnumType.STRING)
    private SurfaceEnum surface;

    public Court() {}

    public Court(String name, Club club, SurfaceEnum surface) {
        this.name = name;
        this.club = club;
        this.surface = surface;
    }

    public Long getCourtId() {
        return courtId;
    }

    public void setCourtId(Long courtId) {
        this.courtId = courtId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public SurfaceEnum getSurface() {
        return surface;
    }

    public void setSurface(SurfaceEnum surface) {
        this.surface = surface;
    }
}
