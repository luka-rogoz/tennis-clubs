package com.tennisclubs.dao;

import com.tennisclubs.entity.Club;
import com.tennisclubs.entity.Player;
import com.tennisclubs.entity.Represents;
import com.tennisclubs.entity.pkeys.RepresentsPK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepresentsRepository extends JpaRepository<Represents, RepresentsPK> {
    Optional<Represents> findByPlayer(Player player);
    Optional<Represents> findByClub(Club club);
}
