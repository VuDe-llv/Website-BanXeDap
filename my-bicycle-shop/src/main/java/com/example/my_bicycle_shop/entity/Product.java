package com.example.my_bicycle_shop.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer prd_id;

    @ManyToOne
    @JoinColumn(name = "ctg_id", nullable = true)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brd_id", nullable = true)
    private Brand brand;

    private String prd_name;
    private BigDecimal prd_price;
    private Integer prd_stock;

    private String prd_image;
    private String prd_image1;
    private String prd_image2;
    private String prd_image3;
    private String prd_description;
    private String prd_parameter;

    // Constructors, Getters, and Setters

    public Product() {}

    public Product(String prd_name, BigDecimal prd_price, Integer prd_stock, Category category,
                   Brand brand, String prd_image, String prd_image1, String prd_image2,
                   String prd_image3, String prd_description, String prd_parameter) {
        this.prd_name = prd_name;
        this.prd_price = prd_price;
        this.prd_stock = prd_stock;
        this.category = category;
        this.brand = brand;
        this.prd_image = prd_image;
        this.prd_image1 = prd_image1;
        this.prd_image2 = prd_image2;
        this.prd_image3 = prd_image3;
        this.prd_description = prd_description;
        this.prd_parameter = prd_parameter;
    }

    public Integer getPrd_id() {
        return prd_id;
    }

    public void setPrd_id(Integer prd_id) {
        this.prd_id = prd_id;
    }

    @JsonProperty("ctg_id")
    public Integer getCategoryId() {
        return category != null ? category.getCtg_id() : null;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @JsonProperty("brd_id")
    public Integer getBrandId() {
        return brand != null ? brand.getBrd_id() : null;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public String getPrd_name() {
        return prd_name;
    }

    public void setPrd_name(String prd_name) {
        this.prd_name = prd_name;
    }

    public BigDecimal getPrd_price() {
        return prd_price;
    }

    public void setPrd_price(BigDecimal prd_price) {
        this.prd_price = prd_price;
    }

    public Integer getPrd_stock() {
        return prd_stock;
    }

    public void setPrd_stock(Integer prd_stock) {
        this.prd_stock = prd_stock;
    }

    public String getPrd_image() {
        return prd_image;
    }

    public void setPrd_image(String prd_image) {
        this.prd_image = prd_image;
    }

    public String getPrd_image1() {
        return prd_image1;
    }

    public void setPrd_image1(String prd_image1) {
        this.prd_image1 = prd_image1;
    }

    public String getPrd_image2() {
        return prd_image2;
    }

    public void setPrd_image2(String prd_image2) {
        this.prd_image2 = prd_image2;
    }

    public String getPrd_image3() {
        return prd_image3;
    }

    public void setPrd_image3(String prd_image3) {
        this.prd_image3 = prd_image3;
    }

    public String getPrd_description() {
        return prd_description;
    }

    public void setPrd_description(String prd_description) {
        this.prd_description = prd_description;
    }

    public String getPrd_parameter() {
        return prd_parameter;
    }

    public void setPrd_parameter(String prd_parameter) {
        this.prd_parameter = prd_parameter;
    }
}