package com.cdweb.laptopStore.auth.services;

import com.cdweb.laptopStore.auth.dto.UserDetailsDto;
import com.cdweb.laptopStore.auth.entities.User;
import com.cdweb.laptopStore.auth.mapper.UserDetailsMapper;
import com.cdweb.laptopStore.auth.repositories.UserDetailRepository;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserDetailsMapper userMapper;

    @Autowired
    private UserDetailRepository userDetailRepository;

    CustomUserDetailService(UserDetailsMapper userDetailsMapper) {
        this.userMapper = userDetailsMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user= userDetailRepository.findByEmail(username);
        if(null == user){
            throw new UsernameNotFoundException("User Not Found with userName "+username);
        }
        return user;
    }

    public User save(User user) {
        return userDetailRepository.save(user);
    }

    public UserDetailsDto restoreUser(UUID id) {
        User user = userDetailRepository.findById(id)
                .orElse(null);
        if (user == null) {
            return null;
        }
        user.setEnabled(true);
        user = userDetailRepository.save(user);
        return userMapper.toUserDetailsDto(user);
    }
}
