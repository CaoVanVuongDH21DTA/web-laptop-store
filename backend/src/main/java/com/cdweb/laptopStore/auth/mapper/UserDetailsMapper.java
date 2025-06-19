package com.cdweb.laptopStore.auth.mapper;

import org.springframework.stereotype.Component;

import com.cdweb.laptopStore.auth.dto.UserDetailsDto;
import com.cdweb.laptopStore.auth.entities.User;

@Component
public class UserDetailsMapper {

    public UserDetailsDto toUserDetailsDto(User user) {
        if (user == null) {
            return null;
        }
        return UserDetailsDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray())
                .enabled(user.isEnabled())
                .build();
    }
}