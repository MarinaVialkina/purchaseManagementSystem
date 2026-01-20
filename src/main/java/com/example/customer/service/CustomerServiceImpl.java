package com.example.customer.service;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.dto.request.CustomerFilterRequest;
import com.example.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;



@Service
public class CustomerServiceImpl implements CustomerService{
    @Autowired
    CustomerRepository customerRepository;

    @Override
    public CustomerDTO addCustomer(CustomerDTO newCustomer) {
        CustomerDTO existingCustomer = customerRepository.getRecord(newCustomer.getCustomerCode());
        if (existingCustomer == null){
            customerRepository.addRecord(newCustomer);
        }else{
            throw new IllegalArgumentException("Customer с кодом " + newCustomer.getCustomerCode() + " уже существует");
        }
        return customerRepository.getRecord(newCustomer.getCustomerCode());

    }

    @Override
    public void deleteCustomer(String customerCode) {
        customerRepository.deleteRecord(customerCode);
    }

    @Override
    public CustomerDTO updateCustomer(CustomerDTO updatedCustomer) {
        CustomerDTO existingCustomer = customerRepository.getRecord(updatedCustomer.getCustomerCode());
        if (existingCustomer != null){
            customerRepository.updateRecord(updatedCustomer);
        }else {
            throw new IllegalArgumentException("Customer с кодом " + updatedCustomer.getCustomerCode() + " не найден");
        }
        return customerRepository.getRecord(updatedCustomer.getCustomerCode());
    }


    @Override
    public Page<CustomerDTO> getListOfCustomers(CustomerFilterRequest customerFilter, Pageable pageable) {
        return customerRepository.getAllRecordsWithFilter(customerFilter, pageable);
    }
}
