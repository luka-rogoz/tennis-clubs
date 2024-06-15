package com.tennisclubs.entity.pkeys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class RepresentsPK implements Serializable {
    @Column(name = "playerId")
    private Long playerId;

    @Column(name = "clubId")
    private Long clubId;

    public RepresentsPK() {}

    public RepresentsPK(Long playerId, Long clubId) {
        this.playerId = playerId;
        this.clubId = clubId;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }
}
