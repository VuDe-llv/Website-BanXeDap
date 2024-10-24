package com.example.my_bicycle_shop.service;

import com.example.my_bicycle_shop.entity.Order;
import com.example.my_bicycle_shop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Integer id) {
        return orderRepository.findById(id);
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    public void deleteById(Integer id) {
        orderRepository.deleteById(id);
    }

    public List<Order> findByAuthId(Integer authId) {
        return orderRepository.findAll().stream()
                .filter(order -> order.getAuth() != null && order.getAuth().getAuth_id().equals(authId))
                .toList();
    }
}
