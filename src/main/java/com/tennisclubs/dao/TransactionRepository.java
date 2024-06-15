package com.tennisclubs.dao;

import com.tennisclubs.entity.Club;
import com.tennisclubs.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByTransactionId(Long transactionId);
    boolean existsByTransactionId(Long transactionId);
    Optional<Transaction> findByClub(Club club);
}
