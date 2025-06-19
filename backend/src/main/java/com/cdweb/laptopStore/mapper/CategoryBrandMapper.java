package com.cdweb.laptopStore.mapper;

import com.cdweb.laptopStore.dto.CategoryBrandDto;
import com.cdweb.laptopStore.entities.CategoryBrand;

import org.springframework.stereotype.Component;

@Component
public class CategoryBrandMapper {

    public CategoryBrand mapToEntity(CategoryBrandDto dto) {
        CategoryBrand brand = new CategoryBrand();
        brand.setName(dto.getName());
        brand.setCode(dto.getCode());
        brand.setDescription(dto.getDescription());
        brand.setImgCategory(dto.getImgCategory());
        return brand;
    }
}
