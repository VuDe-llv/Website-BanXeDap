package com.example.my_bicycle_shop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "brand")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer brd_id;

    private String brd_name;

    public Brand() {}

    public Brand(String brd_name) {
        this.brd_name = brd_name;
    }

    public Integer getBrd_id() {
        return brd_id;
    }

    public void setBrd_id(Integer brd_id) {
        this.brd_id = brd_id;
    }

    public String getBrd_name() {
        return brd_name;
    }

    public void setBrd_name(String brd_name) {
        this.brd_name = brd_name;
    }
}
