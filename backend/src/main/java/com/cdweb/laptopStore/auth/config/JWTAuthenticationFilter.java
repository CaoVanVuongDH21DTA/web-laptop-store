package com.cdweb.laptopStore.auth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final UserDetailsService userDetailsService;
    private final JWTTokenHelper jwtTokenHelper;

    public JWTAuthenticationFilter(JWTTokenHelper jwtTokenHelper,UserDetailsService userDetailsService) {
        this.jwtTokenHelper = jwtTokenHelper;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();

        // Danh sách các đường dẫn public mà không cần JWT xác thực
        List<String> publicPaths = Arrays.asList(
            "/api/auth/**",
            "/api/category/**",
            "/api/products/**",
            "/v3/api-docs/**",
            "/swagger-ui/**"
        );

        boolean isPublic = publicPaths.stream()
            .anyMatch(pattern -> pathMatcher.match(pattern, path));

        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        // Xử lý JWT token như cũ
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authToken = jwtTokenHelper.getToken(request);
            if (authToken != null) {
                String userName = jwtTokenHelper.getUserNameFromToken(authToken);
                if (userName != null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
                    if (jwtTokenHelper.validateToken(authToken, userDetails)) {
                        UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    // @Override
    // protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    //         throws ServletException, IOException {

    //     String path = request.getServletPath();
    //     System.out.println("👉 Request path: " + path); // log 1

    //     String authHeader = request.getHeader("Authorization");
    //     System.out.println("👉 Authorization Header: " + authHeader); // log 2

    //     if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    //         System.out.println("❌ No Bearer token found");
    //         filterChain.doFilter(request, response);
    //         return;
    //     }

    //     String token = jwtTokenHelper.getToken(request);
    //     System.out.println("👉 Token extracted: " + token); // log 3

    //     String username = jwtTokenHelper.getUserNameFromToken(token);
    //     System.out.println("👉 Username from token: " + username); // log 4

    //     if (username != null) {
    //         UserDetails userDetails = userDetailsService.loadUserByUsername(username);
    //         System.out.println("👉 UserDetails username: " + userDetails.getUsername()); // log 5

    //         boolean isValid = jwtTokenHelper.validateToken(token, userDetails);
    //         System.out.println("👉 Token valid: " + isValid); // log 6

    //         if (isValid) {
    //             UsernamePasswordAuthenticationToken authenticationToken =
    //                     new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    //             authenticationToken.setDetails(new WebAuthenticationDetails(request));
    //             SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    //         }
    //     }

    //     filterChain.doFilter(request, response);
    // }

}

