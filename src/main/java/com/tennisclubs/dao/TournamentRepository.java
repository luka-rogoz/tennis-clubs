package com.tennisclubs.dao;

import com.tennisclubs.entity.Category;
import com.tennisclubs.entity.Club;
import com.tennisclubs.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    Optional<Tournament> findByTournamentId(Long tournamentId);
    boolean existsByTournamentId(Long tournamentId);
    Optional<Tournament> findByName(String name);
    boolean existsByCategory(Category category);
}
