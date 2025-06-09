package com.cdweb.laptopStore.repositories;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cdweb.laptopStore.entities.ProductSpecification;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, UUID> {

    @Query("""
        SELECT DISTINCT ps.specification, ps.specificationValue
        FROM ProductSpecification ps
        JOIN ps.product p
        JOIN p.categoryType ct
        JOIN ct.category c
        WHERE c.id = :categoryId
    """)
    List<Object[]> findSpecsAndValuesByCategoryId(@Param("categoryId") UUID categoryId);
}
