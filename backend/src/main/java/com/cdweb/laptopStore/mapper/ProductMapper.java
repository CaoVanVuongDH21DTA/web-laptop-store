package com.cdweb.laptopStore.mapper;

import com.cdweb.laptopStore.dto.ProductDto;
import com.cdweb.laptopStore.dto.ProductResourceDto;
import com.cdweb.laptopStore.dto.ProductVariantDto;
import com.cdweb.laptopStore.entities.*;
import com.cdweb.laptopStore.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    @Autowired
    private CategoryService categoryService;

    public Product mapToProductEntity(ProductDto productDto) {
        Product product = new Product();
        Category category = categoryService.getCategory(productDto.getCategoryId());
        if (productDto.getId() != null) {
            product.setId(productDto.getId());
        }
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());

        if (category != null) {
            product.setCategory(category);
            UUID categoryBrandId = productDto.getCategoryBrandId();

            CategoryBrand categoryBrand = category.getCategoryBrands().stream()
                    .filter(ct -> ct.getId().equals(categoryBrandId))
                    .findFirst()
                    .orElse(null);
            product.setCategoryBrand(categoryBrand);
        } else {
            System.out.println("CategoryBrand not found");
        }

        product.setNewArrival(productDto.isNewArrival());
        product.setPrice(productDto.getPrice());
        product.setRating(productDto.getRating());
        product.setSlug(productDto.getSlug());

        if (category != null) {
            product.setCategory(category);
            UUID categoryTypeId = productDto.getCategoryTypeId();

            CategoryType categoryType = category.getCategoryTypes().stream()
                    .filter(ct -> ct.getId().equals(categoryTypeId))
                    .findFirst()
                    .orElse(null);
            product.setCategoryType(categoryType);
        } else {
            System.out.println("CategoryType not found");
        }

        if (productDto.getVariants() != null) {
            product.setProductVariants(mapToProductVariant(productDto.getVariants(), product));
        }

        if (productDto.getProductResources() != null) {
            product.setResources(mapToProductResources(productDto.getProductResources(), product));
        }

        return product;
    }
    private List<Resources> mapToProductResources(List<ProductResourceDto> productResources, Product product) {

        return productResources.stream().map(productResourceDto -> {
            Resources resources= new Resources();
            if(null != productResourceDto.getId()){
                resources.setId(productResourceDto.getId());
            }
            resources.setName(productResourceDto.getName());
            resources.setType(productResourceDto.getType());
            resources.setUrl(productResourceDto.getUrl());
            resources.setIsPrimary(productResourceDto.getIsPrimary());
            resources.setProduct(product);
            return resources;
        }).collect(Collectors.toList());
    }

    private List<ProductVariant> mapToProductVariant(List<ProductVariantDto> productVariantDtos, Product product) {
        return productVariantDtos.stream().map(productVariantDto -> {
            ProductVariant productVariant = new ProductVariant();
            if (productVariantDto.getId() != null) {
                productVariant.setId(productVariantDto.getId());
            }
            productVariant.setColor(productVariantDto.getColor());
            productVariant.setStockQuantity(productVariantDto.getStockQuantity());
            productVariant.setProduct(product);
            return productVariant;
        }).collect(Collectors.toList());
    }

    public List<ProductDto> getProductDtos(List<Product> products) {
        return products.stream().map(this::mapProductToDto).toList();
    }

    public ProductDto mapProductToDto(Product product) {
        ProductDto.ProductDtoBuilder builder = ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .isNewArrival(product.isNewArrival())
                .rating(product.getRating())
                .description(product.getDescription())
                .slug(product.getSlug())
                .thumbnail(getProductThumbnail(product.getResources()));

        // Lấy tên thương hiệu từ categoryBrand
        if (product.getCategoryBrand() != null) {
            builder 
                .categoryBrandId(product.getCategoryBrand().getId())
                .categoryBrandName(product.getCategoryBrand().getName());
        }

        if (product.getCategory() != null) {
            builder.categoryId(product.getCategory().getId());
            builder.categoryName(product.getCategory().getName());
        }

        if (product.getCategoryType() != null) {
            builder.categoryTypeId(product.getCategoryType().getId());
            builder.categoryTypeName(product.getCategoryType().getName());
        }

        if (product.getProductVariants() != null) {
            builder.variants(mapProductVariantListToDto(product.getProductVariants()));
        }

        if (product.getResources() != null) {
            builder.productResources(mapProductResourcesListDto(product.getResources()));
        }

        return builder.build();
    }


    private String getProductThumbnail(List<Resources> resources) {
        return resources.stream()
            .filter(Resources::getIsPrimary)
            .findFirst()
            .map(Resources::getUrl)   
            .orElse(null);  
    }

    public List<ProductVariantDto> mapProductVariantListToDto(List<ProductVariant> productVariants) {
       return productVariants.stream().map(this::mapProductVariantDto).toList();
    }

    private ProductVariantDto mapProductVariantDto(ProductVariant productVariant) {
        return ProductVariantDto.builder()
                .color(productVariant.getColor())
                .id(productVariant.getId())
                .stockQuantity(productVariant.getStockQuantity())
                .build();
    }

    public List<ProductResourceDto> mapProductResourcesListDto(List<Resources> resources) {
        return resources.stream().map(this::mapResourceToDto).toList();
    }

    private ProductResourceDto mapResourceToDto(Resources resources) {
        return ProductResourceDto.builder()
                .id(resources.getId())
                .url(resources.getUrl())
                .name(resources.getName())
                .isPrimary(resources.getIsPrimary())
                .type(resources.getType())
                .build();
    }
}
