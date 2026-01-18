package com.example.customer.repository;

import com.example.customer.dto.CustomerDTO;

import java.util.ArrayList;
import java.util.List;

public interface CustomerRepository {
    void addRecord(CustomerDTO newCustomer);
    void deleteRecord(String customer_code);
    void updateRecord(CustomerDTO updatedCustomer);
    CustomerDTO getRecord(String customer_code);
    List<CustomerDTO> getAllRecord();
}
