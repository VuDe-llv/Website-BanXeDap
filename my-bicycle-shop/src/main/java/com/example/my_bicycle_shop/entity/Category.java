package com.example.my_bicycle_shop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ctg_id;

    private String ctg_name;

    public Category() {}

    public Category(String ctg_name) {
        this.ctg_name = ctg_name;
    }

    public Integer getCtg_id() {
        return ctg_id;
    }

    public void setCtg_id(Integer ctg_id) {
        this.ctg_id = ctg_id;
    }

    public String getCtg_name() {
        return ctg_name;
    }

    public void setCtg_name(String ctg_name) {
        this.ctg_name = ctg_name;
    }
}