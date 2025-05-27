package com.cdweb.laptopStore.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI(){
        return new OpenAPI()
                .info(new Info().title("LaptopStore API's").description("LaptopStore E-commerce Application APIs")
                        .version("1.0")
                        .contact(new Contact()
                                .name("VanVuong")));
    }
}
