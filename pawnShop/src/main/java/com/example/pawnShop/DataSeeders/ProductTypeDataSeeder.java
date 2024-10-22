//package com.example.pawnShop.DataSeeders;
//
//import com.example.pawnShop.Entity.ProductType;
//import com.example.pawnShop.Repository.ProductTypeRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.UUID;
//
//@Component
//public class ProductTypeDataSeeder implements CommandLineRunner {
//
//    @Autowired
//    private final ProductTypeRepository productTypeRepository;
//
//    public ProductTypeDataSeeder(ProductTypeRepository productTypeRepository) {
//        this.productTypeRepository = productTypeRepository;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        List<ProductType> productTypes = new ArrayList<>();
//        productTypes.add(new ProductType(UUID.fromString("2a6ae85c-aeee-4452-a58b-ce54d801daef"), "Телефон"));
//        productTypes.add(new ProductType(UUID.fromString("7698cfb6-697d-409b-a7e4-dc21fa621647"), "Таблет"));
//        productTypes.add(new ProductType(UUID.fromString("7d853cb2-d59a-46ca-905a-09948ac3fc51"), "Телевизор"));
//        productTypes.add(new ProductType(UUID.fromString("a3e82346-3395-4b9c-842d-14973a83fa99"), "Аудио"));
//        productTypes.add(new ProductType(UUID.fromString("e8f6c58c-bb2d-455c-aa1c-6b9f3941c034"), "Електроника"));
//        productTypes.add(new ProductType(UUID.fromString("b5c2d8b9-7b88-4e9f-9729-83f3f9551680"), "Лаптоп"));
//        productTypes.add(new ProductType(UUID.fromString("92e84a89-d806-4b86-bf69-f0e07eeef872"), "Компютър"));
//        productTypes.add(new ProductType(UUID.fromString("7abc38a4-1ac3-4334-ac17-bdafec696987"), "Компютърна периферия"));
//        productTypes.add(new ProductType(UUID.fromString("8a4ed01c-3101-47d8-ac88-de18febf3737"), "Домакински електроуред"));
//        productTypes.add(new ProductType(UUID.fromString("801b09f8-bf92-494e-941e-7c9fe54ef25a"), "Малък електроуред"));
//        productTypes.add(new ProductType(UUID.fromString("c4b52ba5-462a-48fb-b9e5-d38a53c0c1ab"), "Уред за здраве и красота"));
//        productTypes.add(new ProductType(UUID.fromString("55a9017d-bcb4-4e3d-88b1-62970ae6fc4b"), "Фото и видео"));
//        productTypes.add(new ProductType(UUID.fromString("0fe76761-f043-468e-b14f-70ffbec3b6a9"), "Автомобилен аксесоар"));
//        productTypes.add(new ProductType(UUID.fromString("99bef4ec-767b-4833-a6f5-ce387b7499f1"), "Злато"));
//        productTypes.add(new ProductType(UUID.fromString("cc182299-4aa8-4d12-98e9-5a670b757e80"), "Сребро"));
//        productTypes.add(new ProductType(UUID.fromString("21683274-b521-44d4-b396-47077e348377"), "Бижу"));
//
//        int dbCountOfProductTypes = productTypeRepository.getCountOfRecords();
//
//        if(dbCountOfProductTypes <= 0){
//            productTypeRepository.saveAll(productTypes);
//        }
//    }
//}
