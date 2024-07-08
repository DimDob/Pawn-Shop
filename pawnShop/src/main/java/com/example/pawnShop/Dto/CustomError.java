package com.example.pawnShop.Dto;

import lombok.Getter;

@Getter
public class CustomError {
    private final String message;

    private CustomError(String message){
        this.message = message;
    }
    public static CustomError none(){
        return new CustomError("");
    }
    public static CustomError error(String error){
        return new CustomError(error);
    }
}
