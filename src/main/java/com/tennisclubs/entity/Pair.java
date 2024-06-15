package com.tennisclubs.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "pair")
public class Pair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pairId;

    @OneToOne
    @JoinColumn(name = "player1_id", nullable = false)
    private Player player1;

    @OneToOne
    @JoinColumn(name = "player2_id", nullable = false)
    private Player player2;

    @Column(unique = true)
    private Integer rank;

    @OneToMany(mappedBy = "pair1")
    private Set<Match> doublesMatchesPlayedAsHosts;

    @OneToMany(mappedBy = "pair2")
    private Set<Match> doublesMatchesPlayedAsGuests;

    public Pair() {}

    public Pair(Player player1, Player player2, Integer rank) {
        this.player1 = player1;
        this.player2 = player2;
        this.rank = rank;
    }

    public Long getPairId() {
        return pairId;
    }

    public void setPairId(Long pairId) {
        this.pairId = pairId;
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

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Set<Match> getDoublesMatchesPlayedAsHosts() {
        return doublesMatchesPlayedAsHosts;
    }

    public void setDoublesMatchesPlayedAsHosts(Set<Match> doublesMatchesPlayedAsHosts) {
        this.doublesMatchesPlayedAsHosts = doublesMatchesPlayedAsHosts;
    }

    public Set<Match> getDoublesMatchesPlayedAsGuests() {
        return doublesMatchesPlayedAsGuests;
    }

    public void setDoublesMatchesPlayedAsGuests(Set<Match> doublesMatchesPlayedAsGuests) {
        this.doublesMatchesPlayedAsGuests = doublesMatchesPlayedAsGuests;
    }
}
