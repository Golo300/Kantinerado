package com.app.kantinerado.models;

public class PromoteDTO {

    String username;


    public PromoteDTO(){
        super();
    }
    public PromoteDTO(String username)
    {
        super();
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
