package com.cdweb.laptopStore.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "product_specification_values")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpecification {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specification_id", nullable = false)
    @JsonIgnore
    private ProductSpecAttribute specification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specification_value_id", nullable = false)
    @JsonIgnore
    private SpecificationValue specificationValue;
}
