package com.example.customer.service;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.dto.request.CustomerFilterRequest;
import com.example.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class CustomerServiceImpl implements CustomerService{
    @Autowired
    CustomerRepository customerRepository;

    @Transactional
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

    @Transactional
    @Override
    public void deleteCustomer(String customerCode) {
        customerRepository.deleteRecord(customerCode);
    }

    @Transactional
    @Override
    public CustomerDTO updateCustomer(String customerCode, CustomerDTO updatedCustomer) {
        CustomerDTO existingCustomer = customerRepository.getRecord(customerCode);

        if (existingCustomer != null && customerCode.equals(updatedCustomer.getCustomerCode())){
            customerRepository.updateRecord(updatedCustomer);
        }else {
            throw new IllegalArgumentException("Customer с кодом " + updatedCustomer.getCustomerCode() + " не найден");
        }
        return customerRepository.getRecord(updatedCustomer.getCustomerCode());
    }

    @Transactional
    @Override
    public Page<CustomerDTO> getListOfCustomers(CustomerFilterRequest customerFilter, Pageable pageable) {
        return customerRepository.getAllRecordsWithFilter(customerFilter, pageable);
    }
}
