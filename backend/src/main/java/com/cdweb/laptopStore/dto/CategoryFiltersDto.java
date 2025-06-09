package com.cdweb.laptopStore.dto;

import java.util.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryFiltersDto {
    private List<CategoryTypeDto> types;
    private List<SpecificationDTO> specifications;
    private List<CategoryBrandDto> brands;
}
