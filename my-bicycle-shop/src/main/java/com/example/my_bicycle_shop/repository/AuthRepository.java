package com.example.my_bicycle_shop.repository;

import com.example.my_bicycle_shop.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<Auth, Integer> {
}
