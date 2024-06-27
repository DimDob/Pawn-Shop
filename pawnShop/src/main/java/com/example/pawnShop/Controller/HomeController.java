package com.example.pawnShop.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/home")
public class HomeController {
    @GetMapping("/index")
    public String index(){
        return "You are in the index page.";
    }
    @GetMapping("/admin")
    public String adminIndex(){
        return "You are in the admin index page.";
    }
    @GetMapping("/superAdmin")
    public String superAdmin(){
        return "You are in the super admin index page.";
    }
}
