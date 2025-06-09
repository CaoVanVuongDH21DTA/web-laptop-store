package com.cdweb.laptopStore.entities;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecificationKey implements Serializable {
    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "specification_value_id")
    private UUID specificationValueId;
}
