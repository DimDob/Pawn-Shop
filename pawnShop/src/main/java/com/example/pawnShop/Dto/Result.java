package com.example.pawnShop.Dto;

import lombok.Getter;

@Getter
public class Result<T> {

    private final T value;
    private final CustomError error;
    private final boolean isSuccess;

    private Result(T value){
        this.value = value;
        this.error = CustomError.none();
        this.isSuccess = true;
    }
    private Result(String error){
        this.value = null;
        this.error = CustomError.error(error);
        this.isSuccess = false;
    }

    public static <T> Result<T> success(T value){
        return new Result<>(value);
    }
    public static <T> Result<T> error(String error){
        return new Result<>(error);
    }

}
