package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "meeting")
public class Meeting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long meetingId;

    private LocalDateTime meetingTimestamp;

    @Size(max = 500)
    @Column(nullable = false)
    private String agenda;

    @Size(max = 1000)
    private String notes;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToMany
    @JoinTable(
            name = "attends",
            joinColumns = @JoinColumn(name = "meeting_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id"))
    private Set<Person> attendees;

    public Meeting() {}

    public Meeting(LocalDateTime meetingTimestamp, String agenda, String notes, Club club) {
        this.meetingTimestamp = meetingTimestamp;
        this.agenda = agenda;
        this.notes = notes;
        this.club = club;
    }

    public Long getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(Long meetingId) {
        this.meetingId = meetingId;
    }

    public LocalDateTime getMeetingTimestamp() {
        return meetingTimestamp;
    }

    public void setMeetingTimestamp(LocalDateTime meetingTimestamp) {
        this.meetingTimestamp = meetingTimestamp;
    }

    public String getAgenda() {
        return agenda;
    }

    public void setAgenda(String agenda) {
        this.agenda = agenda;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public Set<Person> getAttendees() {
        return attendees;
    }

    public void setAttendees(Set<Person> attendees) {
        this.attendees = attendees;
    }
}
