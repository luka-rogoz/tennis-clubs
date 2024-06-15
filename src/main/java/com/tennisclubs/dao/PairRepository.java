package com.tennisclubs.dao;

import com.tennisclubs.entity.Pair;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PairRepository extends JpaRepository<Pair, Long> {

    Optional<Pair> findByPairId(Long pairId);
    boolean existsByPairId(Long pairId);
}
