package com.example.pawnShop.DataSeeders;

import com.example.pawnShop.Entity.*;
import com.example.pawnShop.Repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {


    private final CityRepository cityRepository;

    private final AddressRepository addressRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final PaymentTypeRepository paymentTypeRepository;

    private final PaymentRepository paymentRepository;

    private final PawnShopRepository pawnShopRepository;

    private final ProductRepository productRepository;

    private final ProductTypeRepository productTypeRepository;

    public DataSeeder(CityRepository cityRepository, AddressRepository addressRepository,
                      PasswordEncoder passwordEncoder, UserRepository userRepository,
                      PaymentTypeRepository paymentTypeRepository, PaymentRepository paymentRepository,
                      PawnShopRepository pawnShopRepository, ProductRepository productRepository, ProductTypeRepository productTypeRepository) {
        this.cityRepository = cityRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.paymentTypeRepository = paymentTypeRepository;
        this.paymentRepository = paymentRepository;
        this.pawnShopRepository = pawnShopRepository;
        this.productRepository = productRepository;
        this.productTypeRepository = productTypeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        setProductTypes();
        setProducts();
    }

    @Bean
    private void setCities(){
        if (this.cityRepository.count() != 0) {
            return;
        }
        List<City> cities = new ArrayList<>();
        City sofia =  City.builder()
                .id(UUID.fromString("0a5fb26f-e1fd-421f-a7c7-1ab88fb43d49"))
                .name("София")
                .build();

        City plovdiv =  City.builder()
                .id(UUID.fromString("dd3df2e4-64e4-470e-bc24-37912b4b94f2"))
                .name("Пловдив")
                .build();

        cities.add(sofia);
        cities.add(plovdiv);

        cityRepository.saveAll(cities);
    }
    @Bean
    private void setAddresses(){
        if (this.addressRepository.count() != 0) {
            return;
        }
      List<City> cities = cityRepository.findAll(Sort.by("name"));

      List<Address> addresses = new ArrayList<>();
      Address addressSofia = Address.builder()
              .id(UUID.fromString("8626bd1b-a64f-4a6b-91bb-07eb5d6c57f2"))
              .name("Стара планина")
              .number("32В")
              .city(cities.get(0))
              .build();

      Address addressPlovdiv = Address.builder()
              .id(UUID.randomUUID())
              .name("Втора")
              .number("2")
              .city(cities.get(1))
              .build();

      addresses.add(addressSofia);
      addresses.add(addressPlovdiv);

      addressRepository.saveAll(addresses);
  }
    @Bean
    private void setUsers(){
        if (this.userRepository.count() != 0) {
            return;
        }
        List<AppUser> users = new ArrayList<>();

        AppUser superAdmin = new AppUser();
        superAdmin.setId(UUID.fromString("2bd8729c-997d-4adb-a19e-9392bc42c7d8"));
        superAdmin.setEmail("superAdmin@admin.com");
        superAdmin.setFirstName("Super");
        superAdmin.setLastName("Admin");
        superAdmin.setRoles(List.of(Role.ROLE_SUPER_ADMIN, Role.ROLE_ADMIN, Role.ROLE_USER));
        String hashedPassword = passwordEncoder.encode("superAdmin123!");
        superAdmin.setPassword(hashedPassword);
        superAdmin.setEnable(true);
        superAdmin.setIsAdmin(true);

        String regularPassword = passwordEncoder.encode("admin123!");
        AppUser firstAdmin = new AppUser();
        firstAdmin.setId(UUID.fromString("f3028111-6be5-4930-86ca-d4c62418f149"));
        firstAdmin.setEmail("firstAdmin@admin.com");
        firstAdmin.setFirstName("First");
        firstAdmin.setLastName("Admin");
        firstAdmin.setPassword(regularPassword);
        firstAdmin.setEnable(true);
        firstAdmin.setRoles(List.of(Role.ROLE_ADMIN, Role.ROLE_USER));
        firstAdmin.setIsAdmin(true);

        AppUser secondAdmin = new AppUser();
        secondAdmin.setId(UUID.fromString("795d12bd-6f24-4167-930e-8632ce112f3d"));
        secondAdmin.setEmail("secondAdmin@admin.com");
        secondAdmin.setFirstName("Second");
        secondAdmin.setLastName("Admin");
        secondAdmin.setPassword(regularPassword);
        secondAdmin.setEnable(true);
        secondAdmin.setRoles(List.of(Role.ROLE_ADMIN, Role.ROLE_USER));
        secondAdmin.setIsAdmin(true);

        AppUser worker = new AppUser();
        worker.setId(UUID.fromString("464e2747-a872-41fa-aafd-6cc4957a7002"));
        worker.setEmail("worker@admin.com");
        worker.setFirstName("Worker the First");
        worker.setLastName("Worker");
        worker.setPassword(regularPassword);
        worker.setEnable(true);
        worker.setRoles(List.of(Role.ROLE_USER));
        worker.setIsAdmin(false);

        users.add(superAdmin);
        users.add(firstAdmin);
        users.add(secondAdmin);
        users.add(worker);

        userRepository.saveAll(users);
    }
    @Bean
    private void setPaymentTypes(){
        if (this.paymentTypeRepository.count() != 0) {
            return;
        }
        List<PaymentType> paymentTypes = new ArrayList<>();

        PaymentType monthly = PaymentType.builder()
                .id(UUID.fromString("bd9ae96b-87d6-4e4d-8716-545502126ef8"))
                .name("Месечен абонамент")
                .subscriptionPrice(BigDecimal.valueOf(150.00))
                .build();
        PaymentType quarterly = PaymentType.builder()
                .id(UUID.fromString("ff3a63a5-8438-4437-badf-932a2ca9aeb5"))
                .name("Тримесечен абонамент")
                .subscriptionPrice(BigDecimal.valueOf(420.00))
                .build();
        PaymentType semiannual = PaymentType.builder()
                .id(UUID.fromString("771bdb9d-da7e-4696-ba45-1a14cff494a9"))
                .name("Шестмесечен абонамент")
                .subscriptionPrice(BigDecimal.valueOf(800.00))
                .build();
        PaymentType annual = PaymentType.builder()
                .id(UUID.fromString("15b8a6e8-4206-4592-a4a8-a2dba2f29f68"))
                .name("Годишен абонамент")
                .subscriptionPrice(BigDecimal.valueOf(1400.00))
                .build();

        paymentTypes.add(monthly);
        paymentTypes.add(quarterly);
        paymentTypes.add(semiannual);
        paymentTypes.add(annual);

        paymentTypeRepository.saveAll(paymentTypes);
    }
    @Bean
    private void setPayments(){
        if (this.paymentRepository.count() != 0) {
            return;
        }
        List<Payment> payments = new ArrayList<>();

        List<PaymentType> paymentTypes = paymentTypeRepository.findAll();

        PaymentType payment = paymentTypeRepository.findById(UUID.fromString("bd9ae96b-87d6-4e4d-8716-545502126ef8")).orElse(null);

        Payment firstPayment = Payment.builder()
                .id(UUID.fromString("55f19c4e-9200-461a-bc53-b65b638d0668"))
                .paymentType(payment)
                .subscriptionStartDate(LocalDate.of(2024, 6, 1).atStartOfDay())
                .subscriptionEndDate(LocalDate.of(2024, 7, 1).atStartOfDay())
                .build();
        Payment secondPayment = Payment.builder()
                .id(UUID.fromString("2107dad7-0fed-4389-8f04-27b1e7f62564"))
                .paymentType(payment)
                .subscriptionStartDate(LocalDate.of(2024, 5, 1).atStartOfDay())
                .subscriptionEndDate(LocalDate.of(2024, 6, 1).atStartOfDay())
                .build();

        payments.add(firstPayment);
        payments.add(secondPayment);

        paymentRepository.saveAll(payments);
    }
    @Bean
    private void setPawnShop(){
        if (this.pawnShopRepository.count() != 0) {
            return;
        }
        List<Address> addresses = addressRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
        List<AppUser> users = userRepository.findAll();
        List<Payment> payments = paymentRepository.findAll();

        List<PawnShop> pawnShops = new ArrayList<>();

        PawnShop firstPawnShop = PawnShop.builder()
                .id(UUID.fromString("6283c5d4-a525-4e90-987a-94d87a3620f8"))
                .name("Залози ЕООД")
                .UIC("123456789")
                .isViesRegistered(true)
                .address(addresses.get(0))
                .adminId(UUID.fromString("f3028111-6be5-4930-86ca-d4c62418f149"))
                .employees(users.stream().filter(u->u.getId().equals(UUID.fromString("f3028111-6be5-4930-86ca-d4c62418f149")) || u.getId().equals(UUID.fromString("464e2747-a872-41fa-aafd-6cc4957a7002"))).toList())
                .payments(payments)
                .registrationDate(LocalDate.of(2024,5,1))
                .isActive(true)
                .build();

        PawnShop secondPawnShop = PawnShop.builder()
                .id(UUID.fromString("424aeb2b-4490-43e6-a60f-a912599f4069"))
                .name("Къща заложна ЕООД")
                .UIC("987654321")
                .isViesRegistered(true)
                .address(addresses.get(1))
                .adminId(UUID.fromString("795d12bd-6f24-4167-930e-8632ce112f3d"))
                .employees(users.stream().filter(u->u.getId().equals(UUID.fromString("795d12bd-6f24-4167-930e-8632ce112f3d"))).toList())
                .payments(payments)
                .registrationDate(LocalDate.of(2024,5,1))
                .isActive(true)
                .build();

        pawnShops.add(firstPawnShop);
        pawnShops.add(secondPawnShop);

        pawnShopRepository.saveAll(pawnShops);
    }

    private void setProductTypes() {
        if (this.productTypeRepository.count() != 0) {
            return;
        }
        List<ProductType> productTypes = new ArrayList<>();
        productTypes.add(new ProductType(UUID.fromString("2a6ae85c-aeee-4452-a58b-ce54d801daef"), "Телефон"));
        productTypes.add(new ProductType(UUID.fromString("7698cfb6-697d-409b-a7e4-dc21fa621647"), "Таблет"));
        productTypes.add(new ProductType(UUID.fromString("7d853cb2-d59a-46ca-905a-09948ac3fc51"), "Телевизор"));
        productTypes.add(new ProductType(UUID.fromString("a3e82346-3395-4b9c-842d-14973a83fa99"), "Аудио"));
        productTypes.add(new ProductType(UUID.fromString("e8f6c58c-bb2d-455c-aa1c-6b9f3941c034"), "Електроника"));
        productTypes.add(new ProductType(UUID.fromString("b5c2d8b9-7b88-4e9f-9729-83f3f9551680"), "Лаптоп"));
        productTypes.add(new ProductType(UUID.fromString("92e84a89-d806-4b86-bf69-f0e07eeef872"), "Компютър"));
        productTypes.add(new ProductType(UUID.fromString("7abc38a4-1ac3-4334-ac17-bdafec696987"), "Компютърна периферия"));
        productTypes.add(new ProductType(UUID.fromString("8a4ed01c-3101-47d8-ac88-de18febf3737"), "Домакински електроуред"));
        productTypes.add(new ProductType(UUID.fromString("801b09f8-bf92-494e-941e-7c9fe54ef25a"), "Малък електроуред"));
        productTypes.add(new ProductType(UUID.fromString("c4b52ba5-462a-48fb-b9e5-d38a53c0c1ab"), "Уред за здраве и красота"));
        productTypes.add(new ProductType(UUID.fromString("55a9017d-bcb4-4e3d-88b1-62970ae6fc4b"), "Фото и видео"));
        productTypes.add(new ProductType(UUID.fromString("0fe76761-f043-468e-b14f-70ffbec3b6a9"), "Автомобилен аксесоар"));
        productTypes.add(new ProductType(UUID.fromString("99bef4ec-767b-4833-a6f5-ce387b7499f1"), "Злато"));
        productTypes.add(new ProductType(UUID.fromString("cc182299-4aa8-4d12-98e9-5a670b757e80"), "Сребро"));
        productTypes.add(new ProductType(UUID.fromString("21683274-b521-44d4-b396-47077e348377"), "Бижу"));

        int dbCountOfProductTypes = productTypeRepository.getCountOfRecords();

        if(dbCountOfProductTypes <= 0){
            productTypeRepository.saveAll(productTypes);
        }
    }


    private void setProducts() {
        if (this.productRepository.count() != 0) {
            return;
        }
        List<Product> products = new ArrayList<>();

        for (int i = 1; i <= 120; i++) {


            List<ProductType> productTypes = this.productTypeRepository.findAll();
            ProductType productType = productTypes.get(i % productTypes.size());

            Product product = Product.builder()
                    .id(UUID.randomUUID())
                    .name("Product " + i)
                    .productType(productType)
                    .marketPrice(BigDecimal.valueOf(100 + i))
                    .pawnPercentage(BigDecimal.valueOf(0.1 * i))
                    .secondHandPrice(BigDecimal.valueOf(50 + i))
                    .pictureUrl("http://example.com/product" + i + ".jpg")
                    .build();
            System.out.println(product);
            products.add(product);
        }

        productRepository.saveAll(products);
    }
}
