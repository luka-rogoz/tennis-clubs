package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.util.Set;

@Entity
@Table(name = "equipment")
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long equipmentId;

    @Size(max = 100)
    @Column(nullable = false, unique = true)
    private String name;

    private Double price;

    @OneToMany(mappedBy = "equipment")
    private Set<Owns> ownedByClubs;

    public Equipment() {}

    public Equipment(String name, Double price) {
        this.name = name;
        this.price = price;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Set<Owns> getOwnedByClubs() {
        return ownedByClubs;
    }

    public void setOwnedByClubs(Set<Owns> ownedByClubs) {
        this.ownedByClubs = ownedByClubs;
    }
}
