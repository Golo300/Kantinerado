package com.app.kantinerado.models;

public class RegistrationDTO {
    private String username;
    private String password;
    private String email;
    private int employeeId;

    public RegistrationDTO() {
        super();
    }

    public RegistrationDTO(int employeeId, String username, String email, String password) {
        super();
        this.username = username;
        this.password = password;
        this.email = email;
        this.employeeId = employeeId;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getEmployeeId() {
        return this.employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public String toString() {
        return "Registration info: username: " + this.username + " password: " + this.password +
                " email: " + this.email + " employeeId: " + this.employeeId;
    }
}
