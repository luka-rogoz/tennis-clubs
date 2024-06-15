package com.tennisclubs.entity;

import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.tennisclubs.entity.pkeys.HoldsTrainingSessionsPK;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "holds_training_sessions")
public class HoldsTrainingSessions {
    @EmbeddedId
    @Column(nullable = false, unique = true)
    private HoldsTrainingSessionsPK altId;

    @ManyToOne
    @MapsId("coachId")
    @JoinColumn(name = "coach_id")
    private Coach coach;

    @ManyToOne
    @MapsId("clubId")
    @JoinColumn(name = "club_id")
    private Club club;

    @Column(nullable = false)
    private LocalDate fromDate;
    private LocalDate toDate;

    public HoldsTrainingSessions() {}

    public HoldsTrainingSessions(Coach coach, Club club, LocalDate fromDate, LocalDate toDate) {
        this.altId = new HoldsTrainingSessionsPK(coach.getPersonId(), club.getClubId());
        this.coach = coach;
        this.club = club;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    public HoldsTrainingSessionsPK getAltId() {
        return altId;
    }

    public void setAltId(HoldsTrainingSessionsPK altId) {
        this.altId = altId;
    }

    public Coach getCoach() {
        return coach;
    }

    public void setCoach(Coach coach) {
        this.coach = coach;
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
