package com.app.kantinerado.models;

public class UserDTO{

    private Integer userId;
    private String username;

	private int employeeiD;

	private String email;

    private Role authorities;

	public UserDTO(Integer userId, Integer employeeiD, String username, String email, Role authorities) {
		this.userId = userId;
		this.employeeiD = employeeiD;
		this.username = username;
		this.email = email;
		this.authorities = authorities;
	}

    public Integer getUserId() {
		return this.userId;
	}
	
	public void setId(Integer userId) {
		this.userId = userId;
	}

	public Integer getEmployeeiD() {
		return this.employeeiD;
	}

	public void setEmployeeiD(Integer employeeiD) {
		this.employeeiD = employeeiD;
	}
	
	public void setAuthorities(Role authorities) {
		this.authorities = authorities;
	}

	public Role getAuthorities() {
		return this.authorities;
	}

	public String getUsername() {
		return this.username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
