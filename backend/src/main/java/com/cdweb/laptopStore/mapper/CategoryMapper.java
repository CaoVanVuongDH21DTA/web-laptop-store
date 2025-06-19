package com.cdweb.laptopStore.mapper;

import com.cdweb.laptopStore.dto.CategoryDto;
import com.cdweb.laptopStore.entities.Category;
import com.cdweb.laptopStore.entities.CategoryType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {

    @Autowired
    private CategoryTypeMapper categoryTypeMapper;

    public CategoryDto mapToDto(Category category) {
        if (category == null) return null;

        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .code(category.getCode())
                .description(category.getDescription())
                .categoryTypes(category.getCategoryTypes() != null
                        ? category.getCategoryTypes().stream()
                            .map(categoryTypeMapper::mapToDto)
                            .collect(Collectors.toList())
                        : null)
                .build();
    }

    public Category mapToEntity(CategoryDto dto) {
        if (dto == null) return null;

        Category category = Category.builder()
                .id(dto.getId())
                .name(dto.getName())
                .code(dto.getCode())
                .description(dto.getDescription())
                .build();

        if (dto.getCategoryTypes() != null) {
            List<CategoryType> types = dto.getCategoryTypes().stream()
                    .map(typeDto -> {
                        CategoryType type = categoryTypeMapper.mapToEntity(typeDto);
                        type.setCategory(category); // thiết lập quan hệ ngược
                        return type;
                    })
                    .collect(Collectors.toList());
            category.setCategoryTypes(types);
        }

        return category;
    }
}
