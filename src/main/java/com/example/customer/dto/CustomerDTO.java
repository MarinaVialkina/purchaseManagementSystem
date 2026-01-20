package com.example.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public class CustomerDTO {
    @NotBlank(message = "Поле  customerCode не заполнено")
    public String customerCode;
    public String customerName;
    @Pattern(regexp = "^\\d{10}$|^\\d{12}$", message = "ИНН должен содержать 10 или 12 цифр")
    public String customerInn;
    @Pattern(regexp = "^\\d{9}$|", message = "ИНН должен содержать 9 цифр")
    public String customerKpp;
    public String customerLegalAddress;
    public String customerPostalAddress;
    @Email(message = "Email должен быть корректным адресом электронной почты")
    public String customerEmail;
    public String customerCodeMain;
    public boolean isOrganization;
    public boolean isPerson;

    public CustomerDTO() {
    }

    public CustomerDTO(String customerCode, String customerName, String customerInn, String customerKpp,
                       String customerLegalAddress, String customerPostalAddress, String customerEmail,
                       String customerCodeMain, boolean isOrganization, boolean isPerson) {
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.customerInn = customerInn;
        this.customerKpp = customerKpp;
        this.customerLegalAddress = customerLegalAddress;
        this.customerPostalAddress = customerPostalAddress;
        this.customerEmail = customerEmail;
        this.customerCodeMain = customerCodeMain;
        this.isOrganization = isOrganization;
        this.isPerson = isPerson;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerInn() {
        return customerInn;
    }

    public void setCustomerInn(String customerInn) {
        this.customerInn = customerInn;
    }

    public String getCustomerKpp() {
        return customerKpp;
    }

    public void setCustomerKpp(String customerKpp) {
        this.customerKpp = customerKpp;
    }

    public String getCustomerLegalAddress() {
        return customerLegalAddress;
    }

    public void setCustomerLegalAddress(String customerLegalAddress) {
        this.customerLegalAddress = customerLegalAddress;
    }

    public String getCustomerPostalAddress() {
        return customerPostalAddress;
    }

    public void setCustomerPostalAddress(String customerPostalAddress) {
        this.customerPostalAddress = customerPostalAddress;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerCodeMain() {
        return customerCodeMain;
    }

    public void setCustomerCodeMain(String customerCodeMain) {
        this.customerCodeMain = customerCodeMain;
    }

    public boolean isOrganization() {
        return isOrganization;
    }

    public void setOrganization(boolean organization) {
        isOrganization = organization;
    }

    public boolean isPerson() {
        return isPerson;
    }

    public void setPerson(boolean person) {
        isPerson = person;
    }
}