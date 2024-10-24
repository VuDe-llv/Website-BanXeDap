package com.example.my_bicycle_shop.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cart_id;

    @ManyToOne
    @JoinColumn(name = "auth_id", nullable = true)
    private Auth auth;

    @ManyToOne
    @JoinColumn(name = "prd_id", nullable = true)
    private Product product;

    private Integer quantity;

    public Cart() {}

    public Cart(Auth auth, Product product, Integer quantity) {
        this.auth = auth;
        this.product = product;
        this.quantity = quantity;
    }

    public Integer getCart_id() {
        return cart_id;
    }

    public void setCart_id(Integer cart_id) {
        this.cart_id = cart_id;
    }

    @JsonProperty("auth_id")
    public Integer getAuthId() {
        return auth != null ? auth.getAuth_id() : null;
    }

    public Auth getAuth() {
        return auth;
    }

    public void setAuth(Auth auth) {
        this.auth = auth;
    }

    @JsonProperty("prd_id")
    public Integer getProductId() {
        return product != null ? product.getPrd_id() : null;
    }

    public Product product() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
