package com.tennisclubs.dao;

import com.tennisclubs.entity.Club;
import com.tennisclubs.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourtRepository extends JpaRepository<Court, Long> {
    Optional<Court> findByClub(Club club);
    boolean existsByCourtId(Long courtId);
    Optional<Court> findByCourtId(Long courtId);
}
