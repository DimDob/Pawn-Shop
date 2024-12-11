// pawnShop\src\main\java\com\example\pawnShop\Controller\ProductController.java
package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;
import com.example.pawnShop.Service.Contract.ProductService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import java.util.UUID;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

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

    @GetMapping("/my-products")
    public ResponseEntity<?> getMyProducts() {
        Result<List<ProductDto>> result = productService.getProductsByCurrentUser();
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        return ResponseEntity.ok(result.getValue());
    }

    @GetMapping("/products")
    @CrossOrigin(origins = {
        "${allowed.origins}"
    }, allowCredentials = "true")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String searchTerm
    ) {
        log.info("Fetching products with sortBy: {}, category: {}, searchTerm: {}", sortBy, category, searchTerm);
        try {
            List<ProductDto> products = productService.getAllProducts(sortBy, category, searchTerm);
            log.info("Successfully fetched {} products", products.size());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error fetching products: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error fetching products: " + e.getMessage());
        }
    }

    @GetMapping("/admin/products")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> getAllProductsForAdmin() {
        log.info("Admin requesting all products");
        Result<List<ProductDto>> result = productService.getAllProductsForAdmin();
        
        if (!result.isSuccess()) {
            log.error("Error fetching products for admin: {}", result.getError());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getError());
        }
        
        log.info("Successfully returned {} products for admin", result.getValue().size());
        return ResponseEntity.ok(result.getValue());
    }
}
