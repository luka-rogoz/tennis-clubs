package com.tennisclubs.dao;

import com.tennisclubs.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoachRepository extends JpaRepository<Coach, Long> {
    Optional<Coach> findByOib(String oib);
    Optional<Coach> findByPersonId(Long coachId);
    boolean existsByPersonId(Long coachId);
}
