package com.cdweb.laptopStore.services;

import com.cdweb.laptopStore.dto.ProductDto;
import com.cdweb.laptopStore.entities.Product;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;


public interface ProductService {

    public Product addProduct(ProductDto product);
    
    public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId);

    // @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productSpecifications ps LEFT JOIN FETCH ps.specification WHERE p.category.id = :categoryId AND p.categoryType.id = :typeId")
    // List<Product> findByCategoryIdAndTypeIdWithSpecifications(UUID categoryId, UUID typeId);


    ProductDto getProductBySlug(String slug);

    ProductDto getProductById(UUID id);

    Product updateProduct(ProductDto productDto, UUID id);

    Product fetchProductById(UUID uuid) throws Exception;
}
