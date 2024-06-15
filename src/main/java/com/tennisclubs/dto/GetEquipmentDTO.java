package com.tennisclubs.dto;

import com.tennisclubs.entity.pkeys.OwnsPK;

public class GetEquipmentDTO {
    private Long equipmentId;
    private String clubName;
    private Integer quantity;
    private String name;
    private Double price;

    public GetEquipmentDTO(Long equipmentId, String clubName, Integer quantity, String name, Double price) {
        this.equipmentId = equipmentId;
        this.clubName = clubName;
        this.quantity = quantity;
        this.name = name;
        this.price = price;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public String getClubName() {
        return clubName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price;
    }
}
