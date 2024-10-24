package com.example.my_bicycle_shop.controller;

import com.example.my_bicycle_shop.entity.Auth;
import com.example.my_bicycle_shop.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})
public class AuthController {
    private static final String UPLOAD_DIR = "src/main/java/com/example/my_bicycle_shop/uploads/images_auth/";
    @Autowired
    private AuthService authService;

    @GetMapping("/getAll")
    public List<Auth> getAllAuths() {
        return authService.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Auth> getAuthById(@PathVariable Integer id) {
        return authService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
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

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Auth auth) {
        Optional<Auth> existingAuth = authService.getAuthByEmail(auth.getAuth_email());
        if (existingAuth.isPresent()) {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }

        if (auth.getAuth_password() == null || !auth.getAuth_password().equals(auth.getAuth_password_confirmation())) {
            return ResponseEntity.badRequest().body("Mật khẩu và xác nhận mật khẩu không khớp");
        }

        Auth savedAuth = authService.register(auth);
        return ResponseEntity.ok("Đăng ký thành công");
    }

    @PostMapping("/login")
    public ResponseEntity<Auth> login(@RequestBody Auth auth) {
        Optional<Auth> existingAuth = authService.getAuthByEmail(auth.getAuth_email());
        if (existingAuth.isPresent()) {
            if (existingAuth.get().getAuth_password().equals(auth.getAuth_password())) {
                return ResponseEntity.ok(existingAuth.get());
            } else {
                return ResponseEntity.status(401).build();
            }
        } else {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Auth> updateAuth(
            @PathVariable Integer id,
            @RequestParam(value = "auth_name", required = false) String auth_name,
            @RequestParam(value = "auth_phone", required = false) String auth_phone,
            @RequestParam(value = "auth_address", required = false) String auth_address,
            @RequestParam(value = "auth_image", required = false) MultipartFile auth_image) {

        Optional<Auth> existingAuthOptional = authService.findById(id);

        if (existingAuthOptional.isPresent()) {
            Auth existingAuth = existingAuthOptional.get();

            if (auth_name != null) {
                existingAuth.setAuth_name(auth_name);
            }
            if (auth_phone != null) {
                existingAuth.setAuth_phone(auth_phone);
            }
            if (auth_address != null) {
                existingAuth.setAuth_address(auth_address);
            }

            if (auth_image != null && !auth_image.isEmpty()) {
                try {
                    String fileName = StringUtils.cleanPath(auth_image.getOriginalFilename());
                    String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                    Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
                    Files.copy(auth_image.getInputStream(), path);

                    existingAuth.setAuth_image(uniqueFileName);
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body(null);
                }
            }

            Auth savedAuth = authService.save(existingAuth);
            return ResponseEntity.ok(savedAuth);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAuth(@PathVariable Integer id) {
        if (authService.findById(id).isPresent()) {
            authService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
