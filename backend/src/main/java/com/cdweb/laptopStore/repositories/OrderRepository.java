package com.cdweb.laptopStore.repositories;

import com.cdweb.laptopStore.auth.entities.User;
import com.cdweb.laptopStore.entities.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUser(User user);

    @Query("SELECT o FROM Order o JOIN FETCH o.user")
    Page<Order> findAllWithUser(Pageable pageable);

    @Query("SELECT o FROM Order o JOIN FETCH o.user WHERE o.id = :id")
    Optional<Order> findByIdWithUser(@Param("id") UUID id);

}
