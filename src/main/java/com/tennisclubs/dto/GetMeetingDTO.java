package com.tennisclubs.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Set;

public class GetMeetingDTO {
    private Long meetingId;
    private LocalDateTime meetingTimestamp;
    private String agenda;
    private String notes;
    private String clubName;
    private Set<String> attendees;

    public GetMeetingDTO(Long meetingId, LocalDateTime meetingTimestamp, String agenda, String notes, String clubName, Set<String> attendees) {
        this.meetingId = meetingId;
        this.meetingTimestamp = meetingTimestamp;
        this.agenda = agenda;
        this.notes = notes;
        this.clubName = clubName;
        this.attendees = attendees;
    }

    public Long getMeetingId() {
        return meetingId;
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

    public String getClubName() {
        return clubName;
    }

    public Set<String> getAttendees() {
        return attendees;
    }
}
