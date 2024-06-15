package com.tennisclubs.dao;

import com.tennisclubs.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlaceRepository extends JpaRepository<Place, Integer> {
    Optional<Place> findByZipCode(Integer zipCode);
}
