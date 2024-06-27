package com.example.pawnShop.Config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import java.io.IOException;

public class AuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        boolean isSuperAdmin = authentication.getAuthorities().stream().anyMatch(au -> au.getAuthority().equals("ROLE_SUPER_ADMIN"));
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(ua -> ua.getAuthority().equals("ROLE_ADMIN"));
        if(isSuperAdmin){
            setDefaultTargetUrl("/home/superAdmin");
        } else if (isAdmin) {
            setDefaultTargetUrl("/home/admin");
        } else{
            setDefaultTargetUrl("/home/index");
        }
        super.onAuthenticationSuccess(request, response, authentication);
    }
}
