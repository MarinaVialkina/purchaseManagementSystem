package com.example.customer.service;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.dto.CustomerSimpleDTO;
import com.example.customer.dto.request.CustomerFilterRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface CustomerService {
    CustomerDTO addCustomer(CustomerDTO newCustomer);
    void deleteCustomer(String customerCode);
    CustomerDTO updateCustomer(String customerCode, CustomerDTO updatedCustomer);

    Page<CustomerDTO> getListOfCustomers(CustomerFilterRequest customerFilter, Pageable pageable);
    List<CustomerSimpleDTO> getCustomersSimpleList();
}
