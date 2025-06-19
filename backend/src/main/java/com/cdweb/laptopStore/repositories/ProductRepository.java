package com.cdweb.laptopStore.repositories;

import com.cdweb.laptopStore.entities.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    Page<Product> findAllByEnabledTrue(Pageable pageable);

    long countByEnabledTrue();

    Page<Product> findAllByEnabledFalse(Pageable pageable);

    long countByEnabledFalse();

    List<Product> findAllByCategoryId(UUID categoryId);

    Product findBySlug(String slug);

    List<Product> findByNameContainingIgnoreCase(String keyword);
    
    @Query("SELECT p FROM Product p " +
        "LEFT JOIN FETCH p.productSpecifications ps " +
        "LEFT JOIN FETCH ps.specification " +
        "LEFT JOIN FETCH ps.specificationValue " +
        "WHERE p.slug = :slug")
    Optional<Product> findBySlugWithSpecifications(@Param("slug") String slug);
}
