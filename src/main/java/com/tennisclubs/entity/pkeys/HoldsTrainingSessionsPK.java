package com.tennisclubs.entity.pkeys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class HoldsTrainingSessionsPK implements Serializable {
    @Column(name = "coachId")
    private Long coachId;

    @Column(name = "clubId")
    private Long clubId;

    public HoldsTrainingSessionsPK() {}

    public HoldsTrainingSessionsPK(Long coachId, Long clubId) {
        this.coachId = coachId;
        this.clubId = clubId;
    }

    public Long getCoachId() {
        return coachId;
    }

    public void setCoachId(Long coachId) {
        this.coachId = coachId;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }
}
