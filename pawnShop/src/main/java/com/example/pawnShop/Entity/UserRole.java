package com.example.pawnShop.Entity;

public enum UserRole {
    USER,
    ADMIN,
    SUPER_ADMIN;
    
    @Override
    public String toString() {
        return this.name();
    }
} 