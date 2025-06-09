package com.cdweb.laptopStore.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "specification_values")
@Data
@NoArgsConstructor
@Builder
public class SpecificationValue {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specification_id", nullable = false)
    private ProductSpecAttribute specification;

    @Column(nullable = false)
    private String value;

    public SpecificationValue(UUID id, ProductSpecAttribute specification, String value) {
        this.id = id;
        this.specification = specification;
        this.value = value;
    }
}
