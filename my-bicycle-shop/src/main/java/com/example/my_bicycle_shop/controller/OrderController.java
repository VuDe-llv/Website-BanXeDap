package com.example.my_bicycle_shop.controller;

import com.example.my_bicycle_shop.entity.*;
import com.example.my_bicycle_shop.service.AuthService;
import com.example.my_bicycle_shop.service.CartService;
import com.example.my_bicycle_shop.service.OrderService;
import com.example.my_bicycle_shop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private AuthService authService;

    @GetMapping("/getAll")
    public List<Order> getAllOrders() {
        return orderService.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        Optional<Order> order = orderService.findById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/getByAuthId/{authId}")
    public ResponseEntity<List<Order>> getOrdersByAuthId(@PathVariable Integer authId) {
        try {
            List<Order> orders = orderService.findByAuthId(authId);
            if (orders.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createOrder(@RequestParam("auth_id") Integer auth_id,
                                              @RequestParam("prd_ids") String prd_ids,
                                              @RequestParam("order_quantity") String order_quantity,
                                              @RequestParam("order_total_price") BigDecimal order_total_price,
                                              @RequestParam("order_payment") String order_payment,
                                              @RequestParam("order_shipp") String order_shipp) {
        try {
            Optional<Auth> authOptional = authService.findById(auth_id);
            if (authOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Auth not found");
            }
            
            String[] prdIdArray = prd_ids.split(",");
            String[] quantityArray = order_quantity.split(",");

            if (prdIdArray.length != quantityArray.length) {
                return ResponseEntity.badRequest().body("Mismatch between product IDs and quantities");
            }

            for (int i = 0; i < prdIdArray.length; i++) {
                String prdIdStr = prdIdArray[i].trim();
                String qtyStr = quantityArray[i].trim();
                try {
                    Integer prd_id = Integer.parseInt(prdIdStr);
                    Integer quantity = Integer.parseInt(qtyStr);

                    Optional<Product> productOptional = productService.findById(prd_id);
                    if (productOptional.isEmpty()) {
                        return ResponseEntity.badRequest().body("Product ID " + prd_id + " not found");
                    }

                    if (quantity <= 0) {
                        return ResponseEntity.badRequest().body("Invalid quantity for product ID " + prd_id);
                    }

                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Invalid product ID or quantity: " + prdIdStr + " or " + qtyStr);
                }
            }

            Auth auth = authOptional.get();
            LocalDateTime orderDate = LocalDateTime.now(ZoneOffset.UTC);
            String status = "Chờ xác nhận";

            Order order = new Order(auth, prd_ids, order_quantity, order_total_price, orderDate, order_payment, order_shipp, status);
            orderService.save(order);

            return ResponseEntity.ok("Order created successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Integer id,
                                             @RequestParam("status") String status) {
        Optional<Order> existingOrder = orderService.findById(id);
        if (existingOrder.isPresent()) {
            Order order = existingOrder.get();
            order.setOrder_status(status);
            orderService.save(order);
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        Optional<Order> existingOrder = orderService.findById(id);
        if (existingOrder.isPresent()) {
            orderService.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelOrder(@PathVariable Integer id) {
        Optional<Order> existingOrder = orderService.findById(id);
        if (existingOrder.isPresent()) {
            Order order = existingOrder.get();
            if ("Chờ xác nhận".equals(order.getOrder_status())) {
                order.setOrder_status("Đã hủy");
                orderService.save(order);
                return ResponseEntity.ok("Order cancelled successfully");
            } else {
                return ResponseEntity.badRequest().body("Order cannot be cancelled");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}