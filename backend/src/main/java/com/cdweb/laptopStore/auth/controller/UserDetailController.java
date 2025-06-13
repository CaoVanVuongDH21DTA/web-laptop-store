package com.cdweb.laptopStore.auth.controller;

import com.cdweb.laptopStore.auth.dto.UserDetailsDto;
import com.cdweb.laptopStore.auth.entities.User;
import com.cdweb.laptopStore.auth.services.CustomUserDetailService;
import com.cdweb.laptopStore.services.CloudinaryService;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Date;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserDetailController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping("/profile")
    public ResponseEntity<UserDetailsDto> getUserProfile(Principal principal) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        UserDetailsDto userDetailsDto = UserDetailsDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray())
                .build();

        return new ResponseEntity<>(userDetailsDto, HttpStatus.OK);
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserProfile(
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "avatarUrl", required = false) String avatarUrl,
            @RequestPart(value = "avatar", required = false) MultipartFile avatarFile,
            Principal principal
    ) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());

        if (user == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        // Cập nhật thông tin cá nhân
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (email != null) user.setEmail(email);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);

        // Upload ảnh đại diện mới nếu có
        try {
            if (avatarFile != null && !avatarFile.isEmpty()) {
                System.out.println("📤 Đang upload file lên Cloudinary...");
                String uploadedFile = cloudinaryService.uploadFile(avatarFile);
                System.out.println("✅ Upload thành công: " + uploadedFile);
                user.setAvatarUrl(uploadedFile);
            }
            else if (avatarUrl != null && !avatarUrl.isEmpty()) {
                String uploadedUrl = cloudinaryService.uploadFileFromUrl(avatarUrl);
                user.setAvatarUrl(uploadedUrl);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload ảnh thất bại: " + e.getMessage());
        }

        user.setUpdatedOn(new Date());
        customUserDetailService.save(user);

        // Trả lại thông tin mới cập nhật
        UserDetailsDto updatedDto = UserDetailsDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray())
                .build();
        return ResponseEntity.ok(updatedDto);
    }
}
