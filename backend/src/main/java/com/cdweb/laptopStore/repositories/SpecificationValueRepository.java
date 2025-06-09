package com.cdweb.laptopStore.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdweb.laptopStore.entities.SpecificationValue;

import java.util.*;

@Repository
public interface SpecificationValueRepository extends JpaRepository<SpecificationValue, UUID> {
    Optional<SpecificationValue> findByValue(String value);
}
