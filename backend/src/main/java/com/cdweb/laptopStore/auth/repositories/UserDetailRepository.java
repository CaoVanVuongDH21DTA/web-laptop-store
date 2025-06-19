package com.cdweb.laptopStore.auth.repositories;

import com.cdweb.laptopStore.auth.dto.UserDetailsDto;
import com.cdweb.laptopStore.auth.entities.User;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends JpaRepository<User,UUID> {
    
    User findByEmail(String username);

    Page<User> findAllByEnabledTrue(Pageable pageable);

    long countByEnabledTrue();

    Page<User> findAllByEnabledFalse(Pageable pageable);

    long countByEnabledFalse();
}
