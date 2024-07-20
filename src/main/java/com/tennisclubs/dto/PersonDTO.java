package com.tennisclubs.dto;

public class PersonDTO {
    private Long personId;
    private String oib;
    private String name;
    private String surname;

    public PersonDTO(Long personId, String oib, String name, String surname) {
        this.personId = personId;
        this.oib = oib;
        this.name = name;
        this.surname = surname;
    }

    public Long getPersonId() {
        return personId;
    }

    public String getOib() {
        return oib;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }
}
