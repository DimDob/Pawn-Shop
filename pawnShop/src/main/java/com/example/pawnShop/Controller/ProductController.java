// pawnShop\src\main\java\com\example\pawnShop\Controller\ProductController.java
package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Service.Contract.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductDto productDto) {
        Result<ProductDto> result = productService.createProduct(productDto);
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(result.getValue());
    }

    // Additional endpoints (e.g., getProduct, updateProduct) can be added here.
}
