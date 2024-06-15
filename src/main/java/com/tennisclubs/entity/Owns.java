package com.tennisclubs.entity;

import com.tennisclubs.entity.pkeys.OwnsPK;
import jakarta.persistence.*;

@Entity
@Table(name = "owns")
public class Owns {
    @EmbeddedId
    @Column(nullable = false, unique = true)
    private OwnsPK ownsId;

    @ManyToOne
    @MapsId("equipmentId")
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne
    @MapsId("clubId")
    @JoinColumn(name = "club_id")
    private Club club;

    private Integer quantity;

    public Owns() {}

    public Owns(Equipment equipment, Club club, Integer quantity) {
        this.ownsId = new OwnsPK(equipment.getEquipmentId(), club.getClubId());
        this.equipment = equipment;
        this.club = club;
        this.quantity = quantity;
    }

    public OwnsPK getOwnsId() {
        return ownsId;
    }

    public void setOwnsId(OwnsPK ownsId) {
        this.ownsId = ownsId;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
