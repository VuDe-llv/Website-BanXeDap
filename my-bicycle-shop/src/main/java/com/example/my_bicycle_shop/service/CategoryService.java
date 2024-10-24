package com.example.my_bicycle_shop.service;

import com.example.my_bicycle_shop.entity.Category;
import com.example.my_bicycle_shop.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public boolean existsByName(String ctg_name) {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().anyMatch(brand -> brand.getCtg_name().equalsIgnoreCase(ctg_name));
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findById(Integer id) {
        return categoryRepository.findById(id);
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteById(Integer id) {
        categoryRepository.deleteById(id);
    }
}
