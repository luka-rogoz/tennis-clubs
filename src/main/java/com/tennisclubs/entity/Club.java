package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(name = "club")
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clubId;

    @Column(nullable = false, unique = true)
    @Size(max = 100)
    private String name;

    private Integer foundationYear;

    @Column(nullable = false)
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 200)
    private String webAddress;

    private Double budget;

    @ManyToOne
    @JoinColumn(name = "zip_code", nullable = false)
    private Place place;

    @OneToMany(mappedBy = "club")
    private Set<HoldsTrainingSessions> coaches;

    @OneToMany(mappedBy = "club")
    private Set<Represents> players;

    @OneToMany(mappedBy = "club")
    private Set<Transaction> transactions;

    @OneToMany(mappedBy = "club")
    private Set<Owns> ownedEquipment;

    public Club() {}

    public Club(String name, Integer foundationYear, String email, String phoneNumber, String webAddress, Double budget, Place place) {
        this.name = name;
        this.foundationYear = foundationYear;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.webAddress = webAddress;
        this.budget = budget;
        this.place = place;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getFoundationYear() {
        return foundationYear;
    }

    public void setFoundationYear(Integer foundationYear) {
        this.foundationYear = foundationYear;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getWebAddress() {
        return webAddress;
    }

    public void setWebAddress(String webAddress) {
        this.webAddress = webAddress;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

    public Set<HoldsTrainingSessions> getCoaches() {
        return coaches;
    }

    public void setCoaches(Set<HoldsTrainingSessions> coaches) {
        this.coaches = coaches;
    }

    public Set<Represents> getPlayers() {
        return players;
    }

    public void setPlayers(Set<Represents> players) {
        this.players = players;
    }

    public Set<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        this.transactions = transactions;
    }

    public Set<Owns> getOwnedEquipment() {
        return ownedEquipment;
    }

    public void setOwnedEquipment(Set<Owns> ownedEquipment) {
        this.ownedEquipment = ownedEquipment;
    }
}
