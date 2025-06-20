package com.cdweb.laptopStore.mapper;

import com.cdweb.laptopStore.dto.ProductDto;
import com.cdweb.laptopStore.dto.ProductResourceDto;
import com.cdweb.laptopStore.dto.ProductSpecificationDto;
import com.cdweb.laptopStore.dto.ProductVariantDto;
import com.cdweb.laptopStore.entities.*;
import com.cdweb.laptopStore.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
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
        return products.stream().map(this::mapToProductDto).toList();
    }
    
    private String getProductThumbnail(List<Resources> resources) {
        return resources.stream()
            .filter(Resources::getIsPrimary)
            .findFirst()
            .map(Resources::getUrl)   
            .orElse(null);  //trả về ảnh default nếu ko có ảnh của product
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

    public ProductDto mapToProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .categoryBrandId(getCategoryBrandId(product))
                .categoryBrandName(getCategoryBrandName(product))
                .isNewArrival(product.isNewArrival())
                .rating(product.getRating())
                .categoryId(getCategoryId(product))
                .thumbnail(getProductThumbnail(product.getResources()))
                .slug(product.getSlug())
                .categoryName(getCategoryName(product))
                .categoryTypeId(getCategoryTypeId(product))
                .categoryTypeName(getCategoryTypeName(product))
                .variants(mapProductVariantListToDto(product.getProductVariants()))
                .productResources(mapProductResourcesListDto(product.getResources()))
                .specifications(mapToProductSpecifications(product.getProductSpecifications()))
                .build();
    }

    // ==== Các phương thức phụ ====

    private UUID getCategoryBrandId(Product product) {
        return product.getCategoryBrand() != null ? product.getCategoryBrand().getId() : null;
    }

    private String getCategoryBrandName(Product product) {
        return product.getCategoryBrand() != null ? product.getCategoryBrand().getName() : null;
    }

    private UUID getCategoryId(Product product) {
        return product.getCategory() != null ? product.getCategory().getId() : null;
    }

    private String getCategoryName(Product product) {
        return product.getCategory() != null ? product.getCategory().getName() : null;
    }

    private UUID getCategoryTypeId(Product product) {
        return product.getCategoryType() != null ? product.getCategoryType().getId() : null;
    }

    private String getCategoryTypeName(Product product) {
        return product.getCategoryType() != null ? product.getCategoryType().getName() : null;
    }


    private List<ProductSpecificationDto> mapToProductSpecifications(List<ProductSpecification> productSpecs) {
        if (productSpecs == null) return new ArrayList<>();

        // Group theo specification name, gom tất cả các value vào Set để loại trùng
        Map<String, Set<String>> grouped = productSpecs.stream()
                .filter(ps -> ps.getSpecification() != null && ps.getSpecificationValue() != null)
                .collect(Collectors.groupingBy(
                        ps -> ps.getSpecification().getLabel(),
                        Collectors.mapping(ps -> ps.getSpecificationValue().getValue(), Collectors.toSet()) // Dùng Set loại trùng
                ));

        // Map sang DTO, nối các value duy nhất thành chuỗi cách nhau bằng dấu phẩy
        return grouped.entrySet().stream()
                .map(entry -> ProductSpecificationDto.builder()
                        .name(entry.getKey())
                        .value(String.join(", ", entry.getValue())) // sẽ chỉ có các value duy nhất
                        .build())
                .collect(Collectors.toList());
    }

}
