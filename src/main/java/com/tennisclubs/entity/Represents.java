package com.tennisclubs.entity;

import com.tennisclubs.entity.pkeys.HoldsTrainingSessionsPK;
import com.tennisclubs.entity.pkeys.RepresentsPK;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "represents")
public class Represents {
    @EmbeddedId
    @Column(nullable = false, unique = true)
    private RepresentsPK altId;

    @ManyToOne
    @MapsId("playerId")
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne
    @MapsId("clubId")
    @JoinColumn(name = "club_id")
    private Club club;

    private LocalDate fromDate;
    private LocalDate toDate;

    public Represents() {}

    public Represents(Player player, Club club, LocalDate fromDate, LocalDate toDate) {
        this.altId = new RepresentsPK(player.getPersonId(), club.getClubId());
        this.player = player;
        this.club = club;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    public RepresentsPK getAltId() {
        return altId;
    }

    public void setAltId(RepresentsPK altId) {
        this.altId = altId;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }
}
