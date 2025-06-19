package com.cdweb.laptopStore.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdweb.laptopStore.entities.SpecificationValue;

import java.util.List;
import java.util.UUID;

@Repository
public interface SpecificationValueRepository extends JpaRepository<SpecificationValue, UUID> {
    List<SpecificationValue> findBySpecificationId(UUID specificationId);
}
