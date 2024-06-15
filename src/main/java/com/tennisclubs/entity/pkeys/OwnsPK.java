package com.tennisclubs.entity.pkeys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class OwnsPK implements Serializable {
    @Column(name = "equipmentId")
    private Long equipmentId;

    @Column(name = "clubId")
    private Long clubId;

    public OwnsPK() {}

    public OwnsPK(Long equipmentId, Long clubId) {
        this.equipmentId = equipmentId;
        this.clubId = clubId;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }
}
