package com.cdweb.laptopStore.services;

import com.cdweb.laptopStore.dto.ProductDto;
import com.cdweb.laptopStore.entities.Category;
import com.cdweb.laptopStore.entities.CategoryBrand;
import com.cdweb.laptopStore.entities.CategoryType;
import com.cdweb.laptopStore.entities.Product;

import org.springframework.data.jpa.domain.Specification;

import com.cdweb.laptopStore.exceptions.ResourceNotFoundEx;
import com.cdweb.laptopStore.mapper.ProductMapper;
import com.cdweb.laptopStore.repositories.CategoryBrandRepository;
import com.cdweb.laptopStore.repositories.CategoryTypeRepository;
import com.cdweb.laptopStore.repositories.CategoryRepository;
import com.cdweb.laptopStore.repositories.ProductRepository;
import com.cdweb.laptopStore.specification.ProductSpecs;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class ProductServiceImpl implements ProductService{

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired 
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryBrandRepository categoryBrandRepository;

    @Autowired
    private CategoryTypeRepository categoryTypeRepository;

    @Override
    public Product addProduct(ProductDto productDto) {
        Product product = productMapper.mapToProductEntity(productDto);

        // ✅ Map các ID sang entity thật
        Category category = categoryRepository.findById(productDto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);

        CategoryBrand categoryBrand = categoryBrandRepository.findById(productDto.getCategoryBrandId())
            .orElseThrow(() -> new RuntimeException("CategoryBrand not found"));
        product.setCategoryBrand(categoryBrand);

        CategoryType categoryType = categoryTypeRepository.findById(productDto.getCategoryTypeId())
            .orElseThrow(() -> new RuntimeException("CategoryType not found"));
        product.setCategoryType(categoryType);

        // Thiết lập quan hệ ngược cho Resources
        if (product.getResources() != null) {
            product.getResources().forEach(r -> {
                try {
                    // Upload ảnh từ URL lên Cloudinary
                    String secureUrl = cloudinaryService.uploadFileFromUrl(r.getUrl());
                    r.setUrl(secureUrl);
                    r.setProduct(product); // thiết lập quan hệ ngược
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload image to Cloudinary: " + e.getMessage());
                }
            });
        }

        // Thiết lập quan hệ ngược cho ProductVariants
        if (product.getProductVariants() != null) {
            product.getProductVariants().forEach(v -> v.setProduct(product));
        }

        // Thiết lập quan hệ ngược cho ProductSpecifications
        if (product.getProductSpecifications() != null) {
            product.getProductSpecifications().forEach(s -> s.setProduct(product));
        }

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setEnabled(false); // ❌ Không xóa thật
        productRepository.save(product); // ✅ Xóa mềm
    }

    @Override
    public ProductDto restoreProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setEnabled(true);
        product = productRepository.save(product);

        return productMapper.mapToProductDto(product);
    }


    @Override
    public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId, Boolean enabled) {
        Specification<Product> productSpecification = Specification.where(null);

        if (enabled != null) {
            if (enabled) {
                productSpecification = productSpecification.and(ProductSpecs.isEnabled());
            } else {
                productSpecification = productSpecification.and(ProductSpecs.isNotEnabled());
            }
        }

        if (categoryId != null) {
            productSpecification = productSpecification.and(ProductSpecs.hasCategoryId(categoryId));
        }

        if (typeId != null) {
            productSpecification = productSpecification.and(ProductSpecs.hasCategoryTypeId(typeId));
        }

        List<Product> products = productRepository.findAll(productSpecification);
        return productMapper.getProductDtos(products);
    }

    @Override
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlugWithSpecifications(slug)
            .orElseThrow(() -> new ResourceNotFoundEx("Product Not Found!"));

        ProductDto productDto = productMapper.mapToProductDto(product);
        productDto.setCategoryId(product.getCategory().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public ProductDto getProductById(UUID id) {
        Product product= productRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Product Not Found!"));
        ProductDto productDto = productMapper.mapToProductDto(product);
        productDto.setCategoryId(product.getCategory().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public Product updateProduct(ProductDto productDto, UUID id) {
        Product product= productRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Product Not Found!"));
        productDto.setId(product.getId());
        return productRepository.save(productMapper.mapToProductEntity(productDto));
    }

    @Override
    public Product fetchProductById(UUID id) throws Exception {
        return productRepository.findById(id).orElseThrow(BadRequestException::new);
    }

    @Override   
    public List<ProductDto> searchProductsByName(String keyword) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);
        return productMapper.getProductDtos(products);
    }
}
