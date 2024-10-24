package com.example.my_bicycle_shop.controller;

import com.example.my_bicycle_shop.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.my_bicycle_shop.entity.Category;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/getAll")
    public List<Category> getAllCategories() {
        return categoryService.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Integer id) {
        Optional<Category> category = categoryService.findById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<String> createCategory(@RequestBody Category category) {
        if (categoryService.existsByName(category.getCtg_name())) {
            return ResponseEntity.badRequest().body("Danh mục đã tồn tại");
        }
        Category createdCategory = categoryService.save(category);
        return ResponseEntity.ok("Danh mục đã được tạo thành công: " + createdCategory.getCtg_name());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        if (categoryService.findById(id).isPresent()) {
            if (categoryService.existsByName(category.getCtg_name())) {
                return ResponseEntity.badRequest().body("Danh mục đã tồn tại");
            }
            category.setCtg_id(id);
            categoryService.save(category);
            return ResponseEntity.ok("Danh mục đã được cập nhật thành công: " + category.getCtg_name());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        if (categoryService.findById(id).isPresent()) {
            categoryService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}