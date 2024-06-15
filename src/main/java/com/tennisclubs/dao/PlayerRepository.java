package com.tennisclubs.dao;

import com.tennisclubs.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findByOib(String oib);
    boolean existsByPersonId(Long playerId);
    Optional<Player> findByPersonId(Long playerId);
}
