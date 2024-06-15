package com.tennisclubs.dto;

public class AddEquipmentDTO {
    private String clubName;
    private Integer quantity;
    private String name;
    private Double price;

    public AddEquipmentDTO(String clubName, Integer quantity, String name, Double price) {
        this.clubName = clubName;
        this.quantity = quantity;
        this.name = name;
        this.price = price;
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
