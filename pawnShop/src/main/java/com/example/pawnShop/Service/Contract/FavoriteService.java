// pawnShop/src/main/java/com/example/pawnShop/Service/Contract/FavoriteService.java

package com.example.pawnShop.Service.Contract;

import com.example.pawnShop.Dto.Product.ProductDto;
import com.example.pawnShop.Dto.Result;

import java.util.List;
import java.util.UUID;

public interface FavoriteService {

    Result<List<ProductDto>> getFavoriteProducts();

    Result<Void> addProductToFavorites(UUID productId);

    Result<Void> removeProductFromFavorites(UUID productId);
}
