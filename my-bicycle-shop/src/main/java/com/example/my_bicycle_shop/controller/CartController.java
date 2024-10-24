package com.example.my_bicycle_shop.controller;

import com.example.my_bicycle_shop.entity.*;
import com.example.my_bicycle_shop.service.AuthService;
import com.example.my_bicycle_shop.service.CartService;
import com.example.my_bicycle_shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private AuthService authService;

    @Autowired
    private ProductService productService;

    @GetMapping("/getAll")
    public List<Cart> getAllCart() {
        return cartService.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Cart> getCartById(@PathVariable Integer id) {
        Optional<Cart> cart = cartService.findById(id);
        return cart.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/getByAuthId/{authId}")
    public ResponseEntity<List<Cart>> getCartByAuthId(@PathVariable Integer authId) {
        try {
            List<Cart> cartItems = cartService.findByAuthId(authId);
            if (cartItems.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createCart(@RequestParam("auth_id") Integer auth_id,
                                             @RequestParam("prd_id") Integer prd_id,
                                             @RequestParam("quantity") Integer quantity) {
        try {
            Optional<Auth> authOptional = authService.findById(auth_id);
            if (!authOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Không tìm thấy tài khoản");
            }

            Optional<Product> productOptional = productService.findById(prd_id);
            if (!productOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Không tìm thấy sản phẩm");
            }

            Product product = productOptional.get();
            Auth auth = authOptional.get();

            if (quantity > product.getPrd_stock()) {
                return ResponseEntity.status(400).body("Không đủ hàng");
            }

            Optional<Cart> existingCart = cartService.findByAuthIdAndPrdId(auth_id, prd_id);
            if (existingCart.isPresent()) {
                Cart cart = existingCart.get();
                cart.setQuantity(cart.getQuantity() + quantity);
                cartService.save(cart);
                return ResponseEntity.ok("Đã cập nhật số lượng vào giỏ hàng");
            }

            Cart cart = new Cart();
            cart.setAuth(auth);
            cart.setProduct(product);
            cart.setQuantity(quantity);
            cartService.save(cart);

            return ResponseEntity.ok("Sản phẩm được thêm vào giỏ hàng");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Cart> updateCart(
            @PathVariable Integer id,
            @RequestParam("quantity") Integer quantity
    ) {
        try {
            Optional<Cart> existingCart = cartService.findById(id);
            if (existingCart.isPresent()) {
                Cart cart = existingCart.get();

                cart.setQuantity(quantity);
                cartService.save(cart);

                return ResponseEntity.ok(cart);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Integer id) {
        try {
            Optional<Cart> existingCart = cartService.findById(id);
            if (existingCart.isPresent()) {
                cartService.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build(); // Internal Server Error
        }
    }
}
