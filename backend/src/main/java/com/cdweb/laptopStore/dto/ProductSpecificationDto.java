package com.cdweb.laptopStore.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductSpecificationDto {
    private String name;    // Tên thông số: RAM, CPU, GPU...
    private String value;   // Giá trị: 8GB, Intel i7...
}

