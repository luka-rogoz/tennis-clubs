package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "person")
@Inheritance(strategy = InheritanceType.JOINED)
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long personId;

    @Column(nullable = false, unique = true)
    @Size(min = 11, max = 11)
    private String oib;

    @Column(nullable = false)
    @Size(max = 100)
    private String name;

    @Column(nullable = false)
    @Size(max = 100)
    private String surname;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private SexEnum sex;

    @ManyToOne
    @JoinColumn(name = "zip_code", nullable = false)
    private Place place;

    @OneToMany(mappedBy = "person")
    private Set<Transaction> transactions;

    @ManyToMany(mappedBy = "attendees")
    private Set<Meeting> attendedMeetings;

    public Person() {}

    public Person(String oib, String name, String surname, LocalDate dateOfBirth, SexEnum sex, Place place) {
        this.oib = oib;
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.sex = sex;
        this.place = place;
    }

    public Long getPersonId() {
        return personId;
    }

    public void setPersonId(Long personId) {
        this.personId = personId;
    }

    public String getOib() {
        return oib;
    }

    public void setOib(String oib) {
        this.oib = oib;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public SexEnum getSex() {
        return sex;
    }

    public void setSex(SexEnum sex) {
        this.sex = sex;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

    public Set<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(Set<Transaction> transactions) {
        this.transactions = transactions;
    }

    public Set<Meeting> getAttendedMeetings() {
        return attendedMeetings;
    }

    public void setAttendedMeetings(Set<Meeting> attendedMeetings) {
        this.attendedMeetings = attendedMeetings;
    }
}
