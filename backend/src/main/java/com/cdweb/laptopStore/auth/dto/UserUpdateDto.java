package com.cdweb.laptopStore.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    private String avatarUrl;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
}
