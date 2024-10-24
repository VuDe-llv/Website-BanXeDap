package com.example.my_bicycle_shop.service;

import com.example.my_bicycle_shop.entity.Auth;
import com.example.my_bicycle_shop.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private AuthRepository authRepository;

    public List<Auth> findAll() {
        return authRepository.findAll();
    }

    public Optional<Auth> findById(Integer id) {
        return authRepository.findById(id);
    }

    public Auth save(Auth auth) {
        return authRepository.save(auth);
    }

    public void deleteById(Integer id) {
        authRepository.deleteById(id);
    }

    public Optional<Auth> getAuthByEmail(String email) {
        List<Auth> authList = authRepository.findAll();

        if (authList.isEmpty()) {
            return Optional.empty();
        }

        return authList.stream()
                .filter(auth -> auth.getAuth_email().equalsIgnoreCase(email))
                .findFirst();
    }

    public Auth register(Auth auth) {
        auth.setAuth_role("User");
        if (auth.getAuth_image() == null || auth.getAuth_image().isEmpty()) {
            auth.setAuth_image("default_image.png");
        }
        return authRepository.save(auth);
    }
}