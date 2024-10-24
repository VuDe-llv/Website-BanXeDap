package com.example.my_bicycle_shop.controller;

import com.example.my_bicycle_shop.entity.Brand;
import com.example.my_bicycle_shop.entity.Category;
import com.example.my_bicycle_shop.entity.Product;
import com.example.my_bicycle_shop.service.BrandService;
import com.example.my_bicycle_shop.service.CategoryService;
import com.example.my_bicycle_shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class ProductController {
    private static final String UPLOAD_DIR = "src/main/java/com/example/my_bicycle_shop/uploads/images_prd/";
    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BrandService brandService;

    @GetMapping("/getAll")
    public List<Product> getAllProducts() {
        return productService.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        Optional<Product> product = productService.findById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
        try {
            Path imagePath = Paths.get(UPLOAD_DIR + fileName);
            byte[] imageBytes = Files.readAllBytes(imagePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(
            @RequestParam("prd_name") String prd_name,
            @RequestParam("prd_price") BigDecimal prd_price,
            @RequestParam("prd_stock") Integer prd_stock,
            @RequestParam("prd_image") MultipartFile prd_image,
            @RequestParam("prd_image1") MultipartFile prd_image1,
            @RequestParam("prd_image2") MultipartFile prd_image2,
            @RequestParam("prd_image3") MultipartFile prd_image3,
            @RequestParam("prd_description") String prd_description,
            @RequestParam("prd_parameter") String prd_parameter,
            @RequestParam("ctg_id") Integer ctg_id,
            @RequestParam("brd_id") Integer brd_id) {
        Product product = new Product();
        try {
            if (!prd_image.isEmpty()) {
                String fileName = StringUtils.cleanPath(prd_image.getOriginalFilename());
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                Files.copy(prd_image.getInputStream(), path);
                product.setPrd_image(uniqueFileName);
            }

            if (!prd_image1.isEmpty()) {
                String fileName = StringUtils.cleanPath(prd_image1.getOriginalFilename());
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                Files.copy(prd_image1.getInputStream(), path);
                product.setPrd_image1(uniqueFileName);
            }

            if (!prd_image2.isEmpty()) {
                String fileName = StringUtils.cleanPath(prd_image2.getOriginalFilename());
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                Files.copy(prd_image2.getInputStream(), path);
                product.setPrd_image2(uniqueFileName);
            }

            if (!prd_image3.isEmpty()) {
                String fileName = StringUtils.cleanPath(prd_image3.getOriginalFilename());
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                Files.copy(prd_image3.getInputStream(), path);
                product.setPrd_image3(uniqueFileName);
            }

            Optional<Category> categoryOptional = categoryService.findById(ctg_id);
            if (categoryOptional.isPresent()) {
                product.setCategory(categoryOptional.get());
            } else {
                return ResponseEntity.badRequest().body(null);
            }

            Optional<Brand> brandOptional = brandService.findById(brd_id);
            if (brandOptional.isPresent()) {
                product.setBrand(brandOptional.get());
            } else {
                return ResponseEntity.badRequest().body(null);
            }

            product.setPrd_name(prd_name);
            product.setPrd_price(prd_price);
            product.setPrd_stock(prd_stock);
            product.setPrd_description(prd_description);
            product.setPrd_parameter(prd_parameter);

            productService.save(product);

            return ResponseEntity.ok(product);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Integer id,
            @RequestParam("prd_name") String prd_name,
            @RequestParam("prd_price") BigDecimal prd_price,
            @RequestParam("prd_stock") Integer prd_stock,
            @RequestParam(value = "prd_image", required = false) MultipartFile prd_image,
            @RequestParam(value = "prd_image1", required = false) MultipartFile prd_image1,
            @RequestParam(value = "prd_image2", required = false) MultipartFile prd_image2,
            @RequestParam(value = "prd_image3", required = false) MultipartFile prd_image3,
            @RequestParam("prd_description") String prd_description,
            @RequestParam("prd_parameter") String prd_parameter,
            @RequestParam("ctg_id") Integer ctg_id,
            @RequestParam("brd_id") Integer brd_id) {

        Optional<Product> productOptional = productService.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            try {
                if (prd_image != null && !prd_image.isEmpty()) {
                    deleteOldFile(product.getPrd_image());
                    String fileName = StringUtils.cleanPath(prd_image.getOriginalFilename());
                    String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                    Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                    Files.copy(prd_image.getInputStream(), path);
                    product.setPrd_image(uniqueFileName);
                }

                if (prd_image1 != null && !prd_image1.isEmpty()) {
                    deleteOldFile(product.getPrd_image1());
                    String fileName = StringUtils.cleanPath(prd_image1.getOriginalFilename());
                    String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                    Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                    Files.copy(prd_image1.getInputStream(), path);
                    product.setPrd_image1(uniqueFileName);
                }

                if (prd_image2 != null && !prd_image2.isEmpty()) {
                    deleteOldFile(product.getPrd_image2());
                    String fileName = StringUtils.cleanPath(prd_image2.getOriginalFilename());
                    String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                    Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                    Files.copy(prd_image2.getInputStream(), path);
                    product.setPrd_image2(uniqueFileName);
                }

                if (prd_image3 != null && !prd_image3.isEmpty()) {
                    deleteOldFile(product.getPrd_image3());
                    String fileName = StringUtils.cleanPath(prd_image3.getOriginalFilename());
                    String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                    Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                    Files.copy(prd_image3.getInputStream(), path);
                    product.setPrd_image3(uniqueFileName);
                }

                product.setPrd_name(prd_name);
                product.setPrd_price(prd_price);
                product.setPrd_stock(prd_stock);
                product.setPrd_description(prd_description);
                product.setPrd_parameter(prd_parameter);

                Optional<Category> categoryOptional = categoryService.findById(ctg_id);
                if (categoryOptional.isPresent()) {
                    product.setCategory(categoryOptional.get());
                } else {
                    return ResponseEntity.badRequest().body(null);
                }

                Optional<Brand> brandOptional = brandService.findById(brd_id);
                if (brandOptional.isPresent()) {
                    product.setBrand(brandOptional.get());
                } else {
                    return ResponseEntity.badRequest().body(null);
                }

                productService.save(product);

                return ResponseEntity.ok(product);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(null);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        Optional<Product> productOptional = productService.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            try {
                deleteOldFile(product.getPrd_image());
                deleteOldFile(product.getPrd_image1());
                deleteOldFile(product.getPrd_image2());
                deleteOldFile(product.getPrd_image3());

                productService.deleteById(id);
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private void deleteOldFile(String fileName) {
        if (fileName != null && !fileName.isEmpty()) {
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
