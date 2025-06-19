package com.cdweb.laptopStore.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.cdweb.laptopStore.entities.CategoryBrand;

public interface CategoryBrandRepository extends JpaRepository<CategoryBrand, UUID>{
    
}
