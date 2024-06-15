package com.tennisclubs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryTypeEnum type;

    @Size(max = 10)
    @Column(nullable = false)
    private String ageLimit;

    @Column(nullable = false)
    private SexEnum sexLimit;

    public Category() {}

    public Category(CategoryTypeEnum type, String ageLimit, SexEnum sexLimit) {
        this.type = type;
        this.ageLimit = ageLimit;
        this.sexLimit = sexLimit;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public CategoryTypeEnum getType() {
        return type;
    }

    public void setType(CategoryTypeEnum type) {
        this.type = type;
    }

    public String getAgeLimit() {
        return ageLimit;
    }

    public void setAgeLimit(String ageLimit) {
        this.ageLimit = ageLimit;
    }

    public SexEnum getSexLimit() {
        return sexLimit;
    }

    public void setSexLimit(SexEnum sexLimit) {
        this.sexLimit = sexLimit;
    }
}
