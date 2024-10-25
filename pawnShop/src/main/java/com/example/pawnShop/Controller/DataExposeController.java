package com.example.pawnShop.Controller;

import com.example.pawnShop.Dto.export.*;
import com.example.pawnShop.Service.Contract.DataExposeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/data/expose")
@RequiredArgsConstructor
public class DataExposeController {

    private final DataExposeService dataExposeService;

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressExportDTO>> getAllAddresses() {
        return ResponseEntity.ok(this.dataExposeService.getAllAddresses());
    }

    @GetMapping("/cities")
    public ResponseEntity<List<CityExportDTO>> getAllCities() {
        return ResponseEntity.ok(this.dataExposeService.getAllCities());
    }

    @GetMapping("/pawnshops")
    public ResponseEntity<List<PawnShopExportDTO>> getAllPawnShops() {
        return ResponseEntity.ok(this.dataExposeService.getAllPawnShops());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentExportDTO>> getAllPayments() {
        return ResponseEntity.ok(this.dataExposeService.getAllPayments());
    }

    @GetMapping("/payment-types")
    public ResponseEntity<List<PaymentTypeExportDTO>> getAllPaymentTypes() {
        return ResponseEntity.ok(dataExposeService.getAllPaymentTypes());
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductExportDTO>> getAllProducts() {
        return ResponseEntity.ok(dataExposeService.getAllProducts());
    }

    @GetMapping("/product-types")
    public ResponseEntity<List<ProductTypeExportDTO>> getAllProductTypes() {
        return ResponseEntity.ok(dataExposeService.getAllProductTypes());
    }

    @GetMapping("/app-users")
    public ResponseEntity<List<AppUserExportDTO>> getAllAppUsers() {
        return ResponseEntity.ok(dataExposeService.getAllAppUsers());
    }

}
