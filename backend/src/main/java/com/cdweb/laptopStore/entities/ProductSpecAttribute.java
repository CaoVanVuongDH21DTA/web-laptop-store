package com.cdweb.laptopStore.entities;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "specifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpecAttribute {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(nullable = false, length = 100)
    private String code;

    @Column(nullable = false, length = 255)
    private String label;

    @OneToMany(mappedBy = "specification")
    @JsonIgnore
    private List<ProductSpecification> productSpecifications;
}
