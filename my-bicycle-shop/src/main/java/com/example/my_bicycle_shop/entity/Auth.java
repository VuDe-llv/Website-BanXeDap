package com.example.my_bicycle_shop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "auth")
public class Auth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer auth_id;

    private String auth_email;
    private String auth_password;
    private String auth_role;
    private String auth_image;
    private String auth_name;
    private String auth_phone;
    private String auth_address;

    @Transient
    private String auth_password_confirmation;

    public Auth() {}

    public Auth(String auth_email, String auth_password, String auth_role, String auth_image,
                String auth_name, String auth_phone, String auth_address) {
        this.auth_email = auth_email;
        this.auth_password = auth_password;
        this.auth_role = auth_role;
        this.auth_image = auth_image;
        this.auth_name = auth_name;
        this.auth_phone = auth_phone;
        this.auth_address = auth_address;
    }

    public String getAuth_password_confirmation() {
        return auth_password_confirmation;
    }

    public void setAuth_password_confirmation(String auth_password_confirmation) {
        this.auth_password_confirmation = auth_password_confirmation;
    }

    public Integer getAuth_id() {
        return auth_id;
    }

    public void setAuth_id(Integer auth_id) {
        this.auth_id = auth_id;
    }

    public String getAuth_email() {
        return auth_email;
    }

    public void setAuth_email(String auth_email) {
        this.auth_email = auth_email;
    }

    public String getAuth_password() {
        return auth_password;
    }

    public void setAuth_password(String auth_password) {
        this.auth_password = auth_password;
    }

    public String getAuth_role() {
        return auth_role;
    }

    public void setAuth_role(String auth_role) {
        this.auth_role = auth_role;
    }

    public String getAuth_image() {
        return auth_image;
    }

    public void setAuth_image(String auth_image) {
        this.auth_image = auth_image;
    }

    public String getAuth_name() {
        return auth_name;
    }

    public void setAuth_name(String auth_name) {
        this.auth_name = auth_name;
    }

    public String getAuth_phone() {
        return auth_phone;
    }

    public void setAuth_phone(String auth_phone) {
        this.auth_phone = auth_phone;
    }

    public String getAuth_address() {
        return auth_address;
    }

    public void setAuth_address(String auth_address) {
        this.auth_address = auth_address;
    }
}
