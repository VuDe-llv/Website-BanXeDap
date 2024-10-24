package com.example.my_bicycle_shop.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_id;

    @ManyToOne
    @JoinColumn(name = "auth_id", nullable = false)
    private Auth auth;

    @Column(name = "prd_id", nullable = false)
    private String prd_ids;

    private String order_quantity;
    private BigDecimal order_total_price;
    private LocalDateTime order_date;
    private String order_payment;
    private String order_shipp;
    private String order_status;

    public Order() {}

    // Constructor mới sử dụng cart_ids là String
    public Order(Auth auth, String prd_ids, String order_quantity, BigDecimal order_total_price, LocalDateTime order_date, String order_payment, String order_shipp, String order_status) {
        this.auth = auth;
        this.prd_ids = prd_ids;
        this.order_quantity = order_quantity;
        this.order_total_price = order_total_price;
        this.order_date = order_date;
        this.order_payment = order_payment;
        this.order_shipp = order_shipp;
        this.order_status = order_status;
    }

    public Integer getOrder_id() {
        return order_id;
    }

    public void setOrder_id(Integer order_id) {
        this.order_id = order_id;
    }

    public Auth getAuth() {
        return auth;
    }

    public void setAuth(Auth auth) {
        this.auth = auth;
    }

    // Getter và setter cho prd_ids
    public String getPrd_ids() {
        return prd_ids;
    }

    public void setPrd_ids(String prd_ids) {
        this.prd_ids = prd_ids;
    }

    public String getOrder_quantity() {
        return order_quantity;
    }

    public void setOrder_quantity(String order_quantity) {
        this.order_quantity = order_quantity;
    }

    public BigDecimal getOrder_total_price() {
        return order_total_price;
    }

    public void setOrder_total_price(BigDecimal order_total_price) {
        this.order_total_price = order_total_price;
    }

    public LocalDateTime getOrder_date() {
        return order_date;
    }

    public void setOrder_date(LocalDateTime order_date) {
        this.order_date = order_date;
    }

    public String getOrder_payment() {
        return order_payment;
    }

    public void setOrder_payment(String order_payment) {
        this.order_payment = order_payment;
    }

    public String getOrder_shipp() {
        return order_shipp;
    }

    public void setOrder_shipp(String order_shipp) {
        this.order_shipp = order_shipp;
    }

    public String getOrder_status() {
        return order_status;
    }

    public void setOrder_status(String order_status) {
        this.order_status = order_status;
    }
}