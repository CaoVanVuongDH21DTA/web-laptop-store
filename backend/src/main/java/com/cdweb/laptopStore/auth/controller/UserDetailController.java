package com.cdweb.laptopStore.auth.controller;

import com.cdweb.laptopStore.auth.dto.UserDetailsDto;
import com.cdweb.laptopStore.auth.entities.User;
import com.cdweb.laptopStore.auth.mapper.UserDetailsMapper;
import com.cdweb.laptopStore.auth.repositories.UserDetailRepository;
import com.cdweb.laptopStore.auth.services.CustomUserDetailService;
import com.cdweb.laptopStore.dto.ProductDto;
import com.cdweb.laptopStore.services.CloudinaryService;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Date;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserDetailController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserDetailsMapper userDetailsMapper;

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

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsers(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "1000") int perPage,
        @RequestParam(required = false) Boolean enabled
    ) {
        PageRequest pageable = PageRequest.of(page - 1, perPage);
        Page<User> users;
        long total;

        if (enabled == null) {
            users = userDetailRepository.findAll(pageable);
            total = userDetailRepository.count();
        } else if (enabled) {
            users = userDetailRepository.findAllByEnabledTrue(pageable);
            total = userDetailRepository.countByEnabledTrue();
        } else {
            users = userDetailRepository.findAllByEnabledFalse(pageable);
            total = userDetailRepository.countByEnabledFalse();
        }

        List<UserDetailsDto> userDtos = users.getContent().stream()
            .map(userDetailsMapper::toUserDetailsDto)
            .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("data", userDtos);
        response.put("total", total);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        Optional<User> optionalUser = userDetailRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            UserDetailsDto dto = UserDetailsDto.builder()
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
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    //  Gửi FORM-DATA
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserById(
            @PathVariable UUID id,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "avatarUrl", required = false) String avatarUrl,
            @RequestPart(value = "avatarFile", required = false) MultipartFile avatarFile,
            @RequestParam(value = "enabled", required = false) Boolean enabled
    ) {
        Optional<User> optionalUser = userDetailRepository.findById(id);
        if (optionalUser.isEmpty()) 
        // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));

        User user = optionalUser.get();
        updateUserInfo(user, firstName, lastName, email, phoneNumber, avatarUrl, avatarFile, enabled);
        
        return ResponseEntity.ok(convertToDto(user));
    }

    //  Gửi JSON
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUserJson(@PathVariable UUID id, @RequestBody UserDetailsDto dto) {
        Optional<User> optionalUser = userDetailRepository.findById(id);
        if (optionalUser.isEmpty()) 
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));

        User user = optionalUser.get();
        updateUserInfo(user, dto.getFirstName(), dto.getLastName(), dto.getEmail(),
                dto.getPhoneNumber(), dto.getAvatarUrl(), null, dto.getEnabled());
        return ResponseEntity.ok(convertToDto(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable UUID id) {
        Optional<User> optionalUser = userDetailRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = optionalUser.get();
        user.setEnabled(false); // 👈 Xóa mềm
        user.setUpdatedOn(new Date()); // cập nhật thời gian
        customUserDetailService.save(user); // hoặc userDetailRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User disabled successfully"));
    }

    // 🔧 Phương thức chung để cập nhật thông tin và upload ảnh
    private void updateUserInfo(User user, String firstName, String lastName, String email, String phoneNumber,
                                String avatarUrl, MultipartFile avatarFile, Boolean enabled) {
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (email != null) user.setEmail(email);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);
        if (enabled != null) user.setEnabled(enabled);

        try {
            if (avatarFile != null && !avatarFile.isEmpty()) {
                String uploadedUrl = cloudinaryService.uploadFile(avatarFile);
                user.setAvatarUrl(uploadedUrl);
            } else if (avatarUrl != null && !avatarUrl.isBlank()) {
                String uploadedUrl = cloudinaryService.uploadFileFromUrl(avatarUrl);
                user.setAvatarUrl(uploadedUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException("Upload ảnh thất bại: " + e.getMessage());
        }

        user.setUpdatedOn(new Date());
        customUserDetailService.save(user);
    }

    // 🔧 Convert User entity sang DTO
    private UserDetailsDto convertToDto(User user) {
        return UserDetailsDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray())
                .build();
    }
}
