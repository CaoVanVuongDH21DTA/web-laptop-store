package com.cdweb.laptopStore.services;

import com.cdweb.laptopStore.dto.CategoryBrandDto;
import com.cdweb.laptopStore.dto.CategoryDto;
import com.cdweb.laptopStore.dto.CategoryFiltersDto;
import com.cdweb.laptopStore.dto.CategoryTypeDto;
import com.cdweb.laptopStore.dto.SpecificationDTO;
import com.cdweb.laptopStore.dto.SpecificationValueDTO;
import com.cdweb.laptopStore.entities.Category;
import com.cdweb.laptopStore.entities.CategoryBrand;
import com.cdweb.laptopStore.entities.CategoryType;
import com.cdweb.laptopStore.entities.Product;
import com.cdweb.laptopStore.entities.ProductSpecAttribute;
import com.cdweb.laptopStore.entities.SpecificationValue;
import com.cdweb.laptopStore.exceptions.ResourceNotFoundEx;
import com.cdweb.laptopStore.mapper.CategoryBrandMapper;
import com.cdweb.laptopStore.mapper.CategoryTypeMapper;
import com.cdweb.laptopStore.repositories.CategoryBrandRepository;
import com.cdweb.laptopStore.repositories.CategoryRepository;
import com.cdweb.laptopStore.repositories.CategoryTypeRepository;
import com.cdweb.laptopStore.repositories.ProductRepository;
import com.cdweb.laptopStore.repositories.ProductSpecificationRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSpecificationRepository productSpecificationRepository;

    @Autowired
    private CategoryTypeMapper categoryTypeMapper;

    @Autowired
    private CategoryBrandMapper categoryBrandMapper;

    @Autowired
    private CategoryTypeRepository categoryTypeRepository;

    @Autowired
    private CategoryBrandRepository categoryBrandRepository;

    public CategoryFiltersDto getFiltersByCategory(UUID categoryId) {
        // 1. Lấy tất cả product thuộc category
        List<Product> products = productRepository.findAllByCategoryId(categoryId);

        // 2. Lấy distinct brands từ products
        List<CategoryBrandDto> brandDtos = products.stream()
                .map(Product::getCategoryBrand)
                .filter(Objects::nonNull)
                .distinct()
                .map(brand -> CategoryBrandDto.builder()
                        .id(brand.getId())
                        .name(brand.getName())
                        .code(brand.getCode())
                        .description(brand.getDescription())
                        .imgCategory(brand.getImgCategory())
                        .build())
                .collect(Collectors.toList());

        // 3. Lấy distinct categoryTypes từ products
        List<CategoryTypeDto> typeDtos = products.stream()
                .map(Product::getCategoryType)
                .filter(Objects::nonNull)
                .distinct()
                .map(type -> CategoryTypeDto.builder()
                        .id(type.getId())
                        .name(type.getName())
                        .code(type.getCode())
                        .description(type.getDescription())
                        .imgCategory(type.getImgCategory())
                        .build())
                .collect(Collectors.toList());


        // 4. Lấy specs + values
        List<Object[]> rawSpecsAndValues = productSpecificationRepository.findSpecsAndValuesByCategoryId(categoryId);

        Map<UUID, ProductSpecAttribute> specsMap = new HashMap<>();
        Map<UUID, Set<SpecificationValueDTO>> specValueMap = new HashMap<>();

        for (Object[] row : rawSpecsAndValues) {
            ProductSpecAttribute spec = (ProductSpecAttribute) row[0];
            SpecificationValue value = (SpecificationValue) row[1];

            specsMap.put(spec.getId(), spec);

            SpecificationValueDTO valDto = SpecificationValueDTO.builder()
                    .id(value.getId())
                    .value(value.getValue())
                    .build();

            specValueMap.computeIfAbsent(spec.getId(), k -> new HashSet<>()).add(valDto);
        }

        List<SpecificationDTO> specDtos = specsMap.values().stream()
                .map(spec -> SpecificationDTO.builder()
                        .id(spec.getId())
                        .name(spec.getLabel())
                        .specificationValues(new ArrayList<>(specValueMap.getOrDefault(spec.getId(), Collections.emptySet())))
                        .build())
                .collect(Collectors.toList());

        return CategoryFiltersDto.builder()
                .types(typeDtos)
                .brands(brandDtos)
                .specifications(specDtos)
                .build();
    }

    public Optional<Category> getCategoryByCode(String code) {
        return categoryRepository.findByCode(code.toLowerCase());
    }

    public Category getCategory(UUID categoryId){
        Optional<Category> category = categoryRepository.findById(categoryId);
        return category.orElse(null);
    }

    public Category createCategory(CategoryDto categoryDto){
        Category category = mapToEntity(categoryDto);
        return categoryRepository.save(category);
    }

    private Category mapToEntity(CategoryDto categoryDto){
        Category category = Category.builder()
                .code(categoryDto.getCode())
                .name(categoryDto.getName())
                .description(categoryDto.getDescription())
                .build();

        if (categoryDto.getCategoryTypes() != null) {
            List<CategoryType> categoryTypes = mapToCategoryTypesList(categoryDto.getCategoryTypes(), category);
            category.setCategoryTypes(categoryTypes);
        }

        if (categoryDto.getCategoryBrands() != null) {
            List<CategoryBrand> categoryBrands = mapToCategoryBrandList(categoryDto.getCategoryBrands(), category);
            category.setCategoryBrands(categoryBrands);
        }

        return category;
    }

    private List<CategoryBrand> mapToCategoryBrandList(List<CategoryBrandDto> brandDtos, Category category) {
        return brandDtos.stream().map(dto -> {
            CategoryBrand brand = new CategoryBrand();
            brand.setCode(dto.getCode());
            brand.setName(dto.getName());
            brand.setDescription(dto.getDescription());
            brand.setCategory(category);
            return brand;
        }).collect(Collectors.toList());
    }

    private List<CategoryType> mapToCategoryTypesList(List<CategoryTypeDto> categoryTypeList, Category category) {
        return categoryTypeList.stream().map(categoryTypeDto -> {
            CategoryType categoryType = new CategoryType();
            categoryType.setCode(categoryTypeDto.getCode());
            categoryType.setName(categoryTypeDto.getName());
            categoryType.setDescription(categoryTypeDto.getDescription());
            categoryType.setCategory(category);
            return categoryType;
        }).collect(Collectors.toList());
    }


    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    // @Transactional
    // public Category updateCategory(UUID categoryId, CategoryDto updatedDto) {
    //     Category existing = categoryRepository.findById(categoryId)
    //             .orElseThrow(() -> new RuntimeException("Category not found"));

    //     // ==== Cập nhật thông tin cơ bản ====
    //     existing.setName(updatedDto.getName());
    //     existing.setCode(updatedDto.getCode());
    //     existing.setDescription(updatedDto.getDescription());

    //     // ==== Cập nhật CategoryTypes ====
    //     Map<String, CategoryType> existingTypeMap = existing.getCategoryTypes().stream()
    //             .collect(Collectors.toMap(CategoryType::getCode, Function.identity()));

    //     List<CategoryType> updatedTypes = new ArrayList<>();
    //     for (CategoryTypeDto dto : updatedDto.getCategoryTypes()) {
    //         CategoryType type = dto.getId() != null ? existingTypeMap.get(dto.getId()) : null;

    //         if (type == null) {
    //             type = categoryTypeMapper.mapToEntity(dto);
    //             type.setCategory(existing);
    //         } else {
    //             type.setName(dto.getName());
    //             type.setCode(dto.getCode()); // ✅ Cập nhật lại luôn code nếu FE thay đổi
    //             type.setDescription(dto.getDescription());
    //             type.setImgCategory(dto.getImgCategory());
    //         }

    //         updatedTypes.add(type);
    //     }

    //     // Xóa các type không còn nữa
    //     existing.getCategoryTypes().clear();
    //     existing.getCategoryTypes().addAll(updatedTypes);

    //     // ==== Cập nhật CategoryBrands ====
    //     Map<String, CategoryBrand> existingBrandMap = existing.getCategoryBrands().stream()
    //             .collect(Collectors.toMap(CategoryBrand::getCode, Function.identity()));

    //     List<CategoryBrand> updatedBrands = new ArrayList<>();
    //     for (CategoryBrandDto dto : updatedDto.getCategoryBrands()) {
    //         CategoryBrand brand = existingBrandMap.get(dto.getCode());

    //         if (brand == null) {
    //             // Thêm mới
    //             brand = categoryBrandMapper.mapToEntity(dto);
    //             brand.setCategory(existing);
    //         } else {
    //             // Cập nhật
    //             brand.setName(dto.getName());
    //             brand.setDescription(dto.getDescription());
    //         }

    //         updatedBrands.add(brand);
    //     }

    //     // Xóa các brand không còn nữa
    //     existing.getCategoryBrands().clear();
    //     existing.getCategoryBrands().addAll(updatedBrands);

    //     return categoryRepository.save(existing);
    // }

    @Transactional
    public Category updateCategory(UUID categoryId, CategoryDto updatedDto) {
        Category existing = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // ==== Cập nhật thông tin cơ bản ====
        existing.setName(updatedDto.getName());
        existing.setCode(updatedDto.getCode());
        existing.setDescription(updatedDto.getDescription());

        // ==== Cập nhật CategoryTypes ====
        Map<UUID, CategoryType> existingTypeMap = existing.getCategoryTypes().stream()
                .filter(ct -> ct.getId() != null)
                .collect(Collectors.toMap(CategoryType::getId, Function.identity()));

        Set<UUID> updatedTypeIds = updatedDto.getCategoryTypes().stream()
                .map(CategoryTypeDto::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Xóa các type cũ không còn nữa
        List<CategoryType> toRemoveTypes = existing.getCategoryTypes().stream()
                .filter(type -> type.getId() != null && !updatedTypeIds.contains(type.getId()))
                .collect(Collectors.toList());
        toRemoveTypes.forEach(type -> categoryTypeRepository.delete(type));

        List<CategoryType> updatedTypes = new ArrayList<>();
        for (CategoryTypeDto dto : updatedDto.getCategoryTypes()) {
            CategoryType type;
            if (dto.getId() != null && existingTypeMap.containsKey(dto.getId())) {
                type = existingTypeMap.get(dto.getId());
                type.setName(dto.getName());
                type.setCode(dto.getCode());
                type.setDescription(dto.getDescription());
                type.setImgCategory(dto.getImgCategory());
            } else {
                type = categoryTypeMapper.mapToEntity(dto);
                type.setCategory(existing);
            }
            updatedTypes.add(type);
        }

        existing.getCategoryTypes().clear();
        existing.getCategoryTypes().addAll(updatedTypes);

        // ==== Cập nhật CategoryBrands ====
        Map<UUID, CategoryBrand> existingBrandMap = existing.getCategoryBrands().stream()
                .filter(cb -> cb.getId() != null)
                .collect(Collectors.toMap(CategoryBrand::getId, Function.identity()));

        Set<UUID> updatedBrandIds = updatedDto.getCategoryBrands().stream()
                .map(CategoryBrandDto::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<CategoryBrand> toRemoveBrands = existing.getCategoryBrands().stream()
                .filter(brand -> brand.getId() != null && !updatedBrandIds.contains(brand.getId()))
                .collect(Collectors.toList());
        toRemoveBrands.forEach(brand -> categoryBrandRepository.delete(brand));

        List<CategoryBrand> updatedBrands = new ArrayList<>();
        for (CategoryBrandDto dto : updatedDto.getCategoryBrands()) {
            CategoryBrand brand;
            if (dto.getId() != null && existingBrandMap.containsKey(dto.getId())) {
                brand = existingBrandMap.get(dto.getId());
                brand.setName(dto.getName());
                brand.setCode(dto.getCode());
                brand.setDescription(dto.getDescription());
                brand.setImgCategory(dto.getImgCategory());
            } else {
                brand = categoryBrandMapper.mapToEntity(dto);
                brand.setCategory(existing);
            }
            updatedBrands.add(brand);
        }

        existing.getCategoryBrands().clear();
        existing.getCategoryBrands().addAll(updatedBrands);

        return categoryRepository.save(existing);
    }


    public void deleteCategory(UUID categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
