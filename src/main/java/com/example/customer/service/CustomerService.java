package com.example.customer.service;

import com.example.customer.dto.CustomerDTO;

public interface CustomerService {
    void addCustomer(CustomerDTO newCustomer);
    void deleteCustomer(String customerCode);
    void updateCustomer(CustomerDTO updatedCustomer);
}
