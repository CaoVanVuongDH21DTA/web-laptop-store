package com.cdweb.laptopStore.mapper;

import com.cdweb.laptopStore.dto.CategoryTypeDto;
import com.cdweb.laptopStore.entities.CategoryType;
import org.springframework.stereotype.Component;

@Component
public class CategoryTypeMapper {

    public CategoryTypeDto mapToDto(CategoryType type) {
        if (type == null) return null;

        return CategoryTypeDto.builder()
                .id(type.getId())
                .name(type.getName())
                .code(type.getCode())
                .description(type.getDescription())
                .imgCategory(type.getImgCategory())
                .build();
    }

    public CategoryType mapToEntity(CategoryTypeDto dto) {
        if (dto == null) return null;

        return CategoryType.builder()
                .id(dto.getId())
                .name(dto.getName())
                .code(dto.getCode())
                .description(dto.getDescription())
                .imgCategory(dto.getImgCategory())
                .build();
    }
}
