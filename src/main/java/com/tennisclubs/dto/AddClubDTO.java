package com.tennisclubs.dto;

public class AddClubDTO {
    private String name;
    private Integer foundationYear;
    private String email;
    private String phoneNumber;
    private String webAddress;
    private Double budget;
    private Integer zipCode;
    private String placeName;

    public AddClubDTO(String name, Integer foundationYear, String email, String phoneNumber, String webAddress, Double budget, Integer zipCode, String placeName) {
        this.name = name;
        this.foundationYear = foundationYear;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.webAddress = webAddress;
        this.budget = budget;
        this.zipCode = zipCode;
        this.placeName = placeName;
    }

    public String getName() {
        return name;
    }

    public Integer getFoundationYear() {
        return foundationYear;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getWebAddress() {
        return webAddress;
    }

    public Double getBudget() {
        return budget;
    }

    public Integer getZipCode() {
        return zipCode;
    }

    public String getPlaceName() {
        return placeName;
    }
}
