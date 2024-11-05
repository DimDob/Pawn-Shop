// pawnShop\src\main\java\com\example\pawnShop\Service\DataExposeServiceImpl.java
package com.example.pawnShop.Service;

import com.example.pawnShop.Dto.export.*;
import com.example.pawnShop.Repository.*;
import com.example.pawnShop.Service.Contract.DataExposeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DataExposeServiceImpl implements DataExposeService {

    private final ModelMapper modelMapper;
    private final AddressRepository addressRepository;
    private final CityRepository cityRepository;
    private final PawnShopRepository pawnShopRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentTypeRepository paymentTypeRepository;
    private final ProductRepository productRepository;
    private final ProductTypeRepository productTypeRepository;
    private final UserRepository userRepository;

    @Override
    public List<AddressExportDTO> getAllAddresses() {
        return this.addressRepository.findAll()
                .stream()
                .map(address -> this.modelMapper.map(address, AddressExportDTO.class))
                .toList();
    }

    @Override
    public List<CityExportDTO> getAllCities() {
        return this.cityRepository.findAll()
                .stream()
                .map(city -> this.modelMapper.map(city, CityExportDTO.class))
                .toList();
    }

    @Override
    public List<PawnShopExportDTO> getAllPawnShops() {
        return this.pawnShopRepository.findAll()
                .stream()
                .map(pawnShop -> this.modelMapper.map(pawnShop, PawnShopExportDTO.class))
                .toList();
    }

    @Override
    public List<PaymentExportDTO> getAllPayments() {
        return this.paymentRepository.findAll()
                .stream()
                .map(payment -> this.modelMapper.map(payment, PaymentExportDTO.class))
                .toList();
    }

    @Override
    public List<PaymentTypeExportDTO> getAllPaymentTypes() {
        return this.paymentTypeRepository.findAll()
                .stream()
                .map(paymentType -> this.modelMapper.map(paymentType, PaymentTypeExportDTO.class))
                .toList();
    }

    @Override
    public List<ProductExportDTO> getAllProducts() {
        return this.productRepository.findAll()
                .stream()
                .map(product -> this.modelMapper.map(product, ProductExportDTO.class))
                .toList();
    }

    @Override
    public List<ProductTypeExportDTO> getAllProductTypes() {
        return this.productTypeRepository.findAll()
                .stream()
                .map(productType -> this.modelMapper.map(productType, ProductTypeExportDTO.class))
                .toList();
    }

    @Override
    public List<AppUserExportDTO> getAllAppUsers() {
        return this.userRepository.findAll()
                .stream()
                .map(appUser -> this.modelMapper.map(appUser, AppUserExportDTO.class))
                .toList();
    }

}
