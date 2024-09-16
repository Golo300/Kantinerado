package com.app.kantinerado.models;


public class ChangePasswordDTO{

    String newPassword;

    String currentPassword;

    ChangePasswordDTO(String currentPassword, String newPassword){
        this.newPassword = newPassword;
        this.currentPassword = currentPassword;
    }

    public String getNewPassword(){
        return newPassword;
    }

    public void setNewPassword(String newPassword){
        this.newPassword = newPassword;
    }

    public String getCurrentPassword(){
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword){
        this.currentPassword = currentPassword;
    }
}
