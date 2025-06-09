package com.cdweb.laptopStore.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecificationDTO {
    private UUID id;
    private String name;
    private List<SpecificationValueDTO> specificationValues;
}
