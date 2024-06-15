package com.tennisclubs.dao;

import com.tennisclubs.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClubRepository extends JpaRepository<Club, Long> {
    Optional<Club> findByClubId(Long clubId);
    boolean existsByClubId(Long clubId);
    Optional<Club> findByName(String name);
}
