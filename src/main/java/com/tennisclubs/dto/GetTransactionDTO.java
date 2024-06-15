package com.tennisclubs.dto;

import com.tennisclubs.entity.PaymentMethodEnum;

import java.time.LocalDateTime;

public class GetTransactionDTO {
    private Long transactionId;
    private String name;
    private String surname;
    private String oib;
    private String clubName;
    private LocalDateTime transactionTimestamp;
    private Double price;
    private PaymentMethodEnum paymentMethod;
    private String description;

    public GetTransactionDTO(Long transactionId, String name, String surname, String oib, String clubName, LocalDateTime transactionTimestamp, Double price, PaymentMethodEnum paymentMethod, String description) {
        this.transactionId = transactionId;
        this.name = name;
        this.surname = surname;
        this.oib = oib;
        this.clubName = clubName;
        this.transactionTimestamp = transactionTimestamp;
        this.price = price;
        this.paymentMethod = paymentMethod;
        this.description = description;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public String getName() {
        return name;
    }
    public String getSurname() { return surname; }

    public String getOib() {
        return oib;
    }

    public String getClubName() {
        return clubName;
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
