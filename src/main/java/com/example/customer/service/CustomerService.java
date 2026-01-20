package com.example.customer.service;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.dto.request.CustomerFilterRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface CustomerService {
    CustomerDTO addCustomer(CustomerDTO newCustomer);
    void deleteCustomer(String customerCode);
    CustomerDTO updateCustomer(CustomerDTO updatedCustomer);

    Page<CustomerDTO> getListOfCustomers(CustomerFilterRequest customerFilter, Pageable pageable);
}
