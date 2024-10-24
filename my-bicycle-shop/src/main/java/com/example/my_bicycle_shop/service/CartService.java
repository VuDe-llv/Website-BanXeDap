package com.example.my_bicycle_shop.service;

import com.example.my_bicycle_shop.entity.Cart;
import com.example.my_bicycle_shop.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    public List<Cart> findAll() {
        return cartRepository.findAll();
    }

    public Optional<Cart> findById(Integer id) {
        return cartRepository.findById(id);
    }

    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    public void deleteById(Integer id) {
        cartRepository.deleteById(id);
    }

    public Optional<Cart> findByAuthIdAndPrdId(Integer authId, Integer prdId) {
        // Iterate through all carts and check for matching authId and prdId
        return cartRepository.findAll().stream()
                .filter(cart -> cart.getAuthId() != null && cart.getAuthId().equals(authId) &&
                        cart.getProductId() != null && cart.getProductId().equals(prdId))
                .findFirst();
    }

    public List<Cart> findByAuthId(Integer authId) {
        return cartRepository.findAll().stream()
                .filter(cart -> cart.getAuth() != null && cart.getAuth().getAuth_id().equals(authId))
                .toList();
    }

}
