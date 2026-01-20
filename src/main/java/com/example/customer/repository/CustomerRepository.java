package com.example.customer.repository;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.dto.request.CustomerFilterRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerRepository {
    void addRecord(CustomerDTO newCustomer);
    void deleteRecord(String customer_code);
    void updateRecord(CustomerDTO updatedCustomer);
    CustomerDTO getRecord(String customer_code);
    List<CustomerDTO> getAllRecord();

    Page<CustomerDTO> getAllRecordsWithFilter(CustomerFilterRequest filter, Pageable pageable);
}
