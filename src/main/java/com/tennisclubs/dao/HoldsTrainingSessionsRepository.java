package com.tennisclubs.dao;

import com.tennisclubs.entity.Club;
import com.tennisclubs.entity.Coach;
import com.tennisclubs.entity.HoldsTrainingSessions;
import com.tennisclubs.entity.pkeys.HoldsTrainingSessionsPK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HoldsTrainingSessionsRepository extends JpaRepository<HoldsTrainingSessions, HoldsTrainingSessionsPK> {
    Optional<HoldsTrainingSessions> findByCoach(Coach coach);
    Optional<HoldsTrainingSessions> findByClub(Club club);
}
