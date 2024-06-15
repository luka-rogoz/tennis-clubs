package com.tennisclubs.dao;

import com.tennisclubs.entity.Club;
import com.tennisclubs.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    Optional<Meeting> findByClub(Club club);
    Optional<Meeting> findByMeetingId(Long meetingId);
    boolean existsByMeetingId(Long meetingId);
}
