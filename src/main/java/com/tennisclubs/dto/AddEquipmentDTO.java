package com.tennisclubs.dto;

public class AddEquipmentDTO {
    private Long clubId;
    private Integer quantity;
    private String name;
    private Double price;

    public AddEquipmentDTO(Long clubId, Integer quantity, String name, Double price) {
        this.clubId = clubId;
        this.quantity = quantity;
        this.name = name;
        this.price = price;
    }

    public Long getClubId() {
        return clubId;
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
