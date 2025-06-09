package com.cdweb.laptopStore.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "category_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryType {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String imgCategory;

    @ManyToOne
    @JoinColumn(name = "category_id",nullable = false)
    @JsonIgnore
    private Category category;
    
    @OneToMany(mappedBy = "categoryType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products;

}
