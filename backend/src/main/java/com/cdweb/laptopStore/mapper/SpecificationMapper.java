package com.cdweb.laptopStore.mapper;

import java.util.List;

import com.cdweb.laptopStore.dto.SpecificationDTO;
import com.cdweb.laptopStore.dto.SpecificationValueDTO;
import com.cdweb.laptopStore.entities.ProductSpecAttribute;

public class SpecificationMapper {

    public static SpecificationDTO toDTO(ProductSpecAttribute spec) {
        if (spec == null) return null;

        List<SpecificationValueDTO> values = null;
        if (spec.getProductSpecifications() != null) {
            values = spec.getProductSpecifications().stream()
                .map(ps -> SpecificationValueMapper.toDTO(ps.getSpecificationValue()))
                .toList();
        }

        return SpecificationDTO.builder()
                .id(spec.getId())
                .name(spec.getLabel())
                .specificationValues(values)
                .build();
    }

    public static ProductSpecAttribute toEntity(SpecificationDTO dto) {
        if (dto == null) return null;
        ProductSpecAttribute spec = new ProductSpecAttribute();
        spec.setId(dto.getId());
        spec.setLabel(dto.getName());
        return spec;
    }
}

