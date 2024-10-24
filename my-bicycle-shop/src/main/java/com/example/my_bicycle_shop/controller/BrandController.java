package com.example.my_bicycle_shop.controller;

import com.example.my_bicycle_shop.entity.Brand;
import com.example.my_bicycle_shop.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/brands")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class BrandController {
    @Autowired
    private BrandService brandService;

    @GetMapping("/getAll")
    public List<Brand> getAllBrands() {
        return brandService.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Integer id) {
        Optional<Brand> brand = brandService.findById(id);
        return brand.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<String> createBrand(@RequestBody Brand brand) {
        if (brandService.existsByName(brand.getBrd_name())) {
            return ResponseEntity.badRequest().body("Thương hiệu đã tồn tại");
        }
        Brand createdBrand = brandService.save(brand);
        return ResponseEntity.ok("Thương hiệu đã được tạo thành công: " + createdBrand.getBrd_name());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateBrand(@PathVariable Integer id, @RequestBody Brand brand) {
        if (brandService.findById(id).isPresent()) {
            if (brandService.existsByName(brand.getBrd_name())) {
                return ResponseEntity.badRequest().body("Thương hiệu đã tồn tại");
            }
            brand.setBrd_id(id);
            brandService.save(brand);
            return ResponseEntity.ok("Thương hiệu đã được cập nhật thành công: " + brand.getBrd_name());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) {
        if (brandService.findById(id).isPresent()) {
            brandService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
