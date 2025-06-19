package com.cdweb.laptopStore.controllers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdweb.laptopStore.dto.SpecificationDTO;
import com.cdweb.laptopStore.dto.SpecificationValueDTO;
import com.cdweb.laptopStore.repositories.ProductSpecAttributeRepository;
import com.cdweb.laptopStore.repositories.SpecificationValueRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/specifications")
@RequiredArgsConstructor
public class SpecificationController {

    private final ProductSpecAttributeRepository specAttrRepo;
    private final SpecificationValueRepository specValueRepo;

    // ✅ Trả về danh sách tất cả specification + danh sách value tương ứng
    @GetMapping
    public List<SpecificationDTO> getAllSpecificationsWithValues() {
        return specAttrRepo.findAll().stream().map(spec -> {
            List<SpecificationValueDTO> values = specValueRepo.findBySpecificationId(spec.getId())
                .stream()
                .map(val -> SpecificationValueDTO.builder()
                        .id(val.getId())
                        .value(val.getValue())
                        .build())
                .collect(Collectors.toList());

            return SpecificationDTO.builder()
                    .id(spec.getId())
                    .name(spec.getLabel())
                    .specificationValues(values)
                    .build();
        }).collect(Collectors.toList());
    }

    // ✅ Trả về danh sách value của 1 specification cụ thể
    @GetMapping("/{id}")
    public List<SpecificationValueDTO> getValuesBySpecificationId(@PathVariable UUID id) {
        return specValueRepo.findBySpecificationId(id).stream()
            .map(val -> SpecificationValueDTO.builder()
                    .id(val.getId())
                    .value(val.getValue())
                    .build())
            .collect(Collectors.toList());
    }
}
