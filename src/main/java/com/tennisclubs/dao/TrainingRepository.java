package com.tennisclubs.dao;

import com.tennisclubs.entity.Coach;
import com.tennisclubs.entity.Training;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainingRepository extends JpaRepository<Training, Long> {
    Optional<Training> findByTrainingId(Long trainingId);
    boolean existsByTrainingId(Long trainingId);
    Optional<Training> findByCoach(Coach coach);
}
