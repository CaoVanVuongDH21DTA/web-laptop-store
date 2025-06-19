package com.cdweb.laptopStore.services;

import com.cdweb.laptopStore.dto.ProductDto;
import com.cdweb.laptopStore.entities.Product;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    public Product addProduct(ProductDto product);

    ProductDto restoreProduct(UUID id);

    void deleteProduct(UUID id);
    
    List<ProductDto> getAllProducts(UUID categoryId, UUID typeId, Boolean enabled);

    ProductDto getProductBySlug(String slug);

    ProductDto getProductById(UUID id);

    Product updateProduct(ProductDto productDto, UUID id);

    Product fetchProductById(UUID uuid) throws Exception;

    List<ProductDto> searchProductsByName(String keyword);
}
