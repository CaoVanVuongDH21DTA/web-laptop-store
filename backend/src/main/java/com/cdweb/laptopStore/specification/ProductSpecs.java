package com.cdweb.laptopStore.specification;

import com.cdweb.laptopStore.dto.ProductFilterRequest;
import com.cdweb.laptopStore.entities.Product;
import com.cdweb.laptopStore.entities.ProductSpecification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ProductSpecs {

    public static Specification<Product> hasCategoryId(UUID categorId){
        return  (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category").get("id"),categorId);
    }

    public static Specification<Product> hasCategoryTypeId(UUID typeId){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("categoryType").get("id"),typeId);
    }

    public static Specification<Product> build(ProductFilterRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Nếu cần lọc theo Category
            if (request.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), request.getCategoryId()));
            }

            // Nếu lọc theo nhiều brandIds
            if (request.getBrandIds() != null && !request.getBrandIds().isEmpty()) {
                predicates.add(root.get("categoryBrand").get("id").in(request.getBrandIds()));
            }

            // Nếu lọc theo nhiều typeIds
            if (request.getTypeIds() != null && !request.getTypeIds().isEmpty()) {
                predicates.add(root.get("categoryType").get("id").in(request.getTypeIds()));
            }

            // Nếu lọc theo specs (key: RAM, value: 16GB)
            if (request.getSpecs() != null && !request.getSpecs().isEmpty()) {
                Join<Product, ProductSpecification> specJoin = root.join("productSpecifications", JoinType.INNER);

                for (Map.Entry<String, String> entry : request.getSpecs().entrySet()) {
                    predicates.add(cb.and(
                        cb.equal(specJoin.get("specification").get("name"), entry.getKey()),
                        cb.equal(specJoin.get("value"), entry.getValue())
                    ));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
