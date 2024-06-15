package com.tennisclubs.dao;

import com.tennisclubs.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByOib(String oib);
}
