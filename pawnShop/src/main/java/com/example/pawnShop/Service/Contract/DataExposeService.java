package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.export.*;

import java.util.List;

public interface DataExposeService {

    List<AddressExportDTO> getAllAddresses();

    List<CityExportDTO> getAllCities();

    List<PawnShopExportDTO> getAllPawnShops();

    List<PaymentExportDTO> getAllPayments();

    List<PaymentTypeExportDTO> getAllPaymentTypes();

    List<ProductExportDTO> getAllProducts();

    List<ProductTypeExportDTO> getAllProductTypes();

    List<AppUserExportDTO> getAllAppUsers();

}
