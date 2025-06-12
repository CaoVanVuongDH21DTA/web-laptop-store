package com.cdweb.laptopStore.repositories;

import org.springframework.stereotype.Repository;

import com.cdweb.laptopStore.entities.ShippingProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


@Repository
public interface ShippingProviderRepository extends JpaRepository<ShippingProvider, UUID> { 
}
