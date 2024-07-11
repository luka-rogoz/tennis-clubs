package com.tennisclubs.dto;

import com.tennisclubs.entity.PaymentMethodEnum;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class AddTransactionDTO {
    private String name;
    private String surname;
    private String oib;
    private Long clubId;
    private LocalDateTime transactionTimestamp;
    private Double price;
    private PaymentMethodEnum paymentMethod;
    private String description;

    public AddTransactionDTO(String name, String surname, String oib, Long clubId, LocalDateTime transactionTimestamp, Double price, PaymentMethodEnum paymentMethod, String description) {
        this.name = name;
        this.surname = surname;
        this.oib = oib;
        this.clubId = clubId;
        this.transactionTimestamp = transactionTimestamp;
        this.price = price;
        this.paymentMethod = paymentMethod;
        this.description = description;
    }

    public String getName() {
        return name;
    }
    public String getSurname() { return surname; }

    public String getOib() {
        return oib;
    }

    public Long getClubId() {
        return clubId;
    }

    public LocalDateTime getTransactionTimestamp() {
        return transactionTimestamp;
    }

    public Double getPrice() {
        return price;
    }

    public PaymentMethodEnum getPaymentMethod() {
        return paymentMethod;
    }

    public String getDescription() {
        return description;
    }
}
