package com.tennisclubs.dto;

import com.tennisclubs.entity.CategoryTypeEnum;
import com.tennisclubs.entity.StageEnum;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class GetMatchDTO {
    private Long matchId;
    private LocalDateTime matchTimestamp;
    private String matchResult;
    private String duration;
    private StageEnum stage;
    private String opponent1;
    private String opponent2;
    private String courtName;
    private String tournamentName;
    private CategoryTypeEnum categoryType;

    public GetMatchDTO(Long matchId, LocalDateTime matchTimestamp, String matchResult, String duration, StageEnum stage, String opponent1, String opponent2, String courtName, String tournamentName, CategoryTypeEnum categoryType) {
        this.matchId = matchId;
        this.matchTimestamp = matchTimestamp;
        this.matchResult = matchResult;
        this.duration = duration;
        this.stage = stage;
        this.opponent1 = opponent1;
        this.opponent2 = opponent2;
        this.courtName = courtName;
        this.tournamentName = tournamentName;
        this.categoryType = categoryType;
    }

    public Long getMatchId() { return matchId; }

    public LocalDateTime getMatchTimestamp() {
        return matchTimestamp;
    }

    public String getMatchResult() {
        return matchResult;
    }

    public String getDuration() {
        return duration;
    }

    public StageEnum getStage() {
        return stage;
    }

    public String getOpponent2() {
        return opponent1;
    }

    public String getOpponent1() {
        return opponent2;
    }

    public String getCourtName() {
        return courtName;
    }

    public String getTournamentName() {
        return tournamentName;
    }

    public CategoryTypeEnum getCategory() { return categoryType; }
}
