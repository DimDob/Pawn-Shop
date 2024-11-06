// pawnShop\src\main\java\com\example\pawnShop\Controller\ProductController.java
package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Service.Contract.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import java.util.UUID;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/product-add")
    public ResponseEntity<?> createProduct(@RequestBody ProductDto productDto) {
        Result<ProductDto> result = productService.createProduct(productDto);
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(result.getValue());
    }

    @PutMapping("/product-edit")
    public ResponseEntity<?> editProduct(@RequestBody ProductDto productDto) {
        Result<ProductDto> result = productService.editProduct(productDto);
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.ok(result.getValue());
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<?> getProductById(@PathVariable UUID id) {
        Result<ProductDto> result = productService.getProductById(id);
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result.getError());
        }
        return ResponseEntity.ok(result.getValue());
    }

    @DeleteMapping("/product-delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        Result<Void> result = productService.deleteProductById(id);
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.TEXT_PLAIN)
                .body(result.getError());
        }
        return ResponseEntity.ok()
            .contentType(MediaType.TEXT_PLAIN)
            .body("Product deleted successfully");
    }
}
