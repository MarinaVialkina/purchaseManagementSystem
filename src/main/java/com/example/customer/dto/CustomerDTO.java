package com.example.customer.dto;


public class CustomerDTO {
    private final String customerCode;
    private final String customerName;
    private final String customerInn;
    private final String customerKpp;
    private final String customerLegalAddress;
    private final String customerPostalAddress;
    private final String customerEmail;
    private final String customerCodeMain;
    private final boolean isOrganization;
    private final boolean isPerson;

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

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerInn() {
        return customerInn;
    }

    public String getCustomerKpp() {
        return customerKpp;
    }

    public String getCustomerLegalAddress() {
        return customerLegalAddress;
    }

    public String getCustomerPostalAddress() {
        return customerPostalAddress;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getCustomerCodeMain() {
        return customerCodeMain;
    }

    public boolean isOrganization() {
        return isOrganization;
    }

    public boolean isPerson() {
        return isPerson;
    }
}
