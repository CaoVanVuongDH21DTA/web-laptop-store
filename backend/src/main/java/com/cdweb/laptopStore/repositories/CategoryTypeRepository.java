package com.cdweb.laptopStore.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.cdweb.laptopStore.entities.CategoryType;

public interface CategoryTypeRepository extends JpaRepository<CategoryType, UUID>{
    
}
