// pawnShop/src/main/java/com/example/pawnShop/Service/FavoriteServiceImp.java

package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Entity.AppUser;
import com.example.pawnShop.Entity.Product;
import com.example.pawnShop.ManualMapper.Contract.ProductManualMapper;
import com.example.pawnShop.Repository.ProductRepository;
import com.example.pawnShop.Repository.UserRepository;
import com.example.pawnShop.Service.Contract.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteServiceImp implements FavoriteService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductManualMapper productManualMapper;

    @Override
    public Result<List<ProductDto>> getFavoriteProducts() {
        try {
            // Get current authenticated user with favorite products
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            AppUser currentUser = userRepository.findWithFavoritesByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Set<Product> favoriteProducts = currentUser.getFavoriteProducts();

            List<ProductDto> productDtos = favoriteProducts.stream()
                    .map(productManualMapper::mapToProductDto)
                    .collect(Collectors.toList());

            return Result.success(productDtos);
        } catch (Exception e) {
            return Result.error("Failed to retrieve favorite products: " + e.getMessage());
        }
    }

    @Override
    public Result<Void> addProductToFavorites(UUID productId) {
        try {
            // Get current authenticated user with favorite products
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            AppUser currentUser = userRepository.findWithFavoritesByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            currentUser.getFavoriteProducts().add(product);

            userRepository.save(currentUser);

            return Result.success(null);
        } catch (Exception e) {
            return Result.error("Failed to add product to favorites: " + e.getMessage());
        }
    }

    @Override
    public Result<Void> removeProductFromFavorites(UUID productId) {
        try {
            // Get current authenticated user with favorite products
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            AppUser currentUser = userRepository.findWithFavoritesByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));

            currentUser.getFavoriteProducts().remove(product);

            userRepository.save(currentUser);

            return Result.success(null);
        } catch (Exception e) {
            return Result.error("Failed to remove product from favorites: " + e.getMessage());
        }
    }
}
