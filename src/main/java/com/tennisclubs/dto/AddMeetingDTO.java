package com.tennisclubs.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Set;

public class AddMeetingDTO {
    private LocalDateTime meetingTimestamp;
    private String agenda;
    private String notes;
    private Long clubId;
    private Set<String> oibs;

    public AddMeetingDTO(LocalDateTime meetingTimestamp, String agenda, String notes, Long clubId, Set<String> oibs) {
        this.meetingTimestamp = meetingTimestamp;
        this.agenda = agenda;
        this.notes = notes;
        this.clubId = clubId;
        this.oibs = oibs;
    }

    public LocalDateTime getMeetingTimestamp() {
        return meetingTimestamp;
    }

    public String getAgenda() {
        return agenda;
    }

    public String getNotes() {
        return notes;
    }

    public Long getClubId() {
        return clubId;
    }

    public Set<String> getOibs() {
        return oibs;
    }
}
