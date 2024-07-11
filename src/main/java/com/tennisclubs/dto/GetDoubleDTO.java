package com.tennisclubs.dto;

import org.springframework.cglib.core.Local;

import java.time.LocalDate;

public class GetDoubleDTO {
    private Long pairId;
    private String player1oib;
    private String player1name;
    private String player1surname;
    private String player2oib;
    private String player2name;
    private String player2surname;
    private Integer rank;
    private LocalDate dateOfTermination;

    public GetDoubleDTO(Long pairId, String player1oib, String player1name, String player1surname, String player2oib, String player2name, String player2surname, Integer rank, LocalDate dateOfTermination) {
        this.pairId = pairId;
        this.player1oib = player1oib;
        this.player1name = player1name;
        this.player1surname = player1surname;
        this.player2oib = player2oib;
        this.player2name = player2name;
        this.player2surname = player2surname;
        this.rank = rank;
        this.dateOfTermination = dateOfTermination;
    }

    public Long getPairId() { return pairId; }

    public String getPlayer1oib() {
        return player1oib;
    }

    public String getPlayer1name() {
        return player1name;
    }

    public String getPlayer1surname() {
        return player1surname;
    }

    public String getPlayer2oib() {
        return player2oib;
    }

    public String getPlayer2name() {
        return player2name;
    }

    public String getPlayer2surname() {
        return player2surname;
    }

    public Integer getRank() {
        return rank;
    }

    public LocalDate getDateOfTermination() { return dateOfTermination; }
}
