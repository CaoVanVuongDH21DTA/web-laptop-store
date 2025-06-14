package com.cdweb.laptopStore.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${FOLDER}")
    private String folder;

    public CloudinaryService(
        @Value("${CLOUD_NAME}") String cloudName,
        @Value("${API_KEY}") String apiKey,
        @Value("${API_SECRET}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }


    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", folder));
        return (String) uploadResult.get("secure_url");
    }

    public String uploadFileFromUrl(String imageUrl) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(imageUrl, 
                ObjectUtils.asMap("folder", folder));
        return (String) uploadResult.get("secure_url");
    }

}
