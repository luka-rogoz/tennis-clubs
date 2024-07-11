package com.tennisclubs.dao;

import com.tennisclubs.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Optional<Equipment> findByName(String name);
    Optional<Equipment> findByEquipmentId(Long equipmentId);
}
