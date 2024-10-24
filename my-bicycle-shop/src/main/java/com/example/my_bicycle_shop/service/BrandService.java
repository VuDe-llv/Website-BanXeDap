package com.example.my_bicycle_shop.service;

import com.example.my_bicycle_shop.entity.Brand;
import com.example.my_bicycle_shop.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    public boolean existsByName(String brd_name) {
        List<Brand> brands = brandRepository.findAll();
        return brands.stream().anyMatch(brand -> brand.getBrd_name().equalsIgnoreCase(brd_name));
    }

    public List<Brand> findAll() {
        return brandRepository.findAll();
    }

    public Optional<Brand> findById(Integer id) {
        return brandRepository.findById(id);
    }

    public Brand save(Brand brand) {
        return brandRepository.save(brand);
    }

    public void deleteById(Integer id) {
        brandRepository.deleteById(id);
    }
}
