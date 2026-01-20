package com.example.customer.dto.request;

public class CustomerFilterRequest {
    private String customerCode;
    private String customerName;
    private String customerInn;
    private String customerKpp;
    private String customerLegalAddress;
    private String customerPostalAddress;
    private String customerEmail;
    private String customerCodeMain;
    private Boolean isOrganization;
    private Boolean isPerson;

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

    public Boolean isOrganization() {
        return isOrganization;
    }

    public void setOrganization(Boolean organization) {
        isOrganization = organization;
    }

    public Boolean isPerson() {
        return isPerson;
    }

    public void setPerson(Boolean person) {
        isPerson = person;
    }
}
