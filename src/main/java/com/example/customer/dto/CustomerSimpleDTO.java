package com.example.customer.dto;

public class CustomerSimpleDTO {
    public String customerCode;
    public String customerName;


    public CustomerSimpleDTO() {
    }

    public CustomerSimpleDTO(String customerCode, String customerName) {
        this.customerCode = customerCode;
        this.customerName = customerName;
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
}
