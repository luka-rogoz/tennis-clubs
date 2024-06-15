package com.tennisclubs.dao;

import com.tennisclubs.entity.Match;
import com.tennisclubs.entity.Pair;
import com.tennisclubs.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {
    boolean existsByMatchId(Long matchId);
    Optional<Match> findByMatchId(Long matchId);
    Optional<Match> findByPlayer1(Player player1);
    Optional<Match> findByPlayer2(Player player2);
    Optional<Match> findByPair1(Pair pair1);
    Optional<Match> findByPair2(Pair pair2);
}
