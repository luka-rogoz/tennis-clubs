package com.tennisclubs.dao;

import com.tennisclubs.entity.Club;
import com.tennisclubs.entity.Equipment;
import com.tennisclubs.entity.Owns;
import com.tennisclubs.entity.pkeys.OwnsPK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OwnsRepository extends JpaRepository<Owns, OwnsPK> {
    Optional<Owns> findByOwnsId(OwnsPK ownsId);
    boolean existsByOwnsId(OwnsPK ownsId);
    boolean existsByEquipment(Equipment equipment);
    Optional<Owns> findByClub(Club club);
}
