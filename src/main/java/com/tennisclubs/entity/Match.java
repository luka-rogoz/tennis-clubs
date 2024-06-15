package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "tennis_match")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long matchId;

    private LocalDateTime matchTimestamp;

    @Size(max = 30)
    @Column(nullable = false)
    private String matchResult;

    @Size(max = 30)
    private String duration;

    @Enumerated(EnumType.STRING)
    private StageEnum stage;

    @ManyToOne
    @JoinColumn(name = "player1_id")
    private Player player1;

    @ManyToOne
    @JoinColumn(name = "player2_id")
    private Player player2;

    @ManyToOne
    @JoinColumn(name = "pair1_id")
    private Pair pair1;

    @ManyToOne
    @JoinColumn(name = "pair2_id")
    private Pair pair2;

    @ManyToOne
    @JoinColumn(name = "court_id", nullable = false)
    private Court court;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    public Match() {}

    public Match(LocalDateTime matchTimestamp, String matchResult, String duration, StageEnum stage, Player player1, Player player2, Pair pair1, Pair pair2, Court court, Tournament tournament) {
        this.matchTimestamp = matchTimestamp;
        this.matchResult = matchResult;
        this.duration = duration;
        this.stage = stage;
        this.player1 = player1;
        this.player2 = player2;
        this.pair1 = pair1;
        this.pair2 = pair2;
        this.court = court;
        this.tournament = tournament;
    }

    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }

    public LocalDateTime getMatchTimestamp() {
        return matchTimestamp;
    }

    public void setMatchTimestamp(LocalDateTime matchTimestamp) {
        this.matchTimestamp = matchTimestamp;
    }

    public String getMatchResult() {
        return matchResult;
    }

    public void setMatchResult(String matchResult) {
        this.matchResult = matchResult;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public StageEnum getStage() {
        return stage;
    }

    public void setStage(StageEnum stage) {
        this.stage = stage;
    }

    public Player getPlayer1() {
        return player1;
    }

    public void setPlayer1(Player player1) {
        this.player1 = player1;
    }

    public Player getPlayer2() {
        return player2;
    }

    public void setPlayer2(Player player2) {
        this.player2 = player2;
    }

    public Pair getPair1() {
        return pair1;
    }

    public void setPair1(Pair pair1) {
        this.pair1 = pair1;
    }

    public Pair getPair2() {
        return pair2;
    }

    public void setPair2(Pair pair2) {
        this.pair2 = pair2;
    }

    public Court getCourt() {
        return court;
    }

    public void setCourt(Court court) {
        this.court = court;
    }

    public Tournament getTournament() {
        return tournament;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }
}
