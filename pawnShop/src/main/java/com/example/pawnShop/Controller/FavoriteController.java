// pawnShop/src/main/java/com/example/pawnShop/Controller/FavoriteController.java

package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Service.Contract.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<?> getFavorites() {
        Result<List<ProductDto>> result = favoriteService.getFavoriteProducts();
        if (!result.isSuccess()) {
            return ResponseEntity.badRequest().body(result.getError());
        }
        return ResponseEntity.ok(result.getValue());
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addFavorite(@PathVariable UUID productId) {
        Result<Void> result = favoriteService.addProductToFavorites(productId);
        if (!result.isSuccess()) {
            return ResponseEntity.badRequest().body(result.getError());
        }
        return ResponseEntity.ok("Product added to favorites");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFavorite(@PathVariable UUID productId) {
        Result<Void> result = favoriteService.removeProductFromFavorites(productId);
        if (!result.isSuccess()) {
            return ResponseEntity.badRequest().body(result.getError());
        }
        return ResponseEntity.ok("Product removed from favorites");
    }
}
