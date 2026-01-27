package com.example.customer.service;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.dto.CustomerSimpleDTO;
import com.example.customer.dto.request.CustomerFilterRequest;
import com.example.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    CustomerRepository customerRepository;

    @Transactional
    @Override
    public CustomerDTO addCustomer(CustomerDTO newCustomer) {
        String customerCodeMain = newCustomer.getCustomerCodeMain();
        if (customerCodeMain != null && customerCodeMain.trim().isEmpty()) {
            newCustomer.customerCodeMain = null;
        }

        CustomerDTO existingCustomer = customerRepository.getRecord(newCustomer.getCustomerCode());
        if (existingCustomer == null) {
            customerRepository.addRecord(newCustomer);
        } else {
            throw new IllegalArgumentException("Customer с кодом " + newCustomer.getCustomerCode() + " уже существует");
        }
        return customerRepository.getRecord(newCustomer.getCustomerCode());

    }

    @Transactional
    @Override
    public void deleteCustomer(String customerCode) {
        CustomerDTO deletedCustomer = customerRepository.getRecord(customerCode);
        if (deletedCustomer == null) {
            throw new IllegalArgumentException("Customer с кодом " + customerCode + " не найден");
        }
        customerRepository.deleteRecord(customerCode);
    }

    @Transactional
    @Override
    public CustomerDTO updateCustomer(String customerCode, CustomerDTO updatedCustomer) {
        String customerCodeMain = updatedCustomer.getCustomerCodeMain();
        if (customerCodeMain != null && customerCodeMain.trim().isEmpty()) {
            updatedCustomer.customerCodeMain = null;
        }

        CustomerDTO existingCustomer = customerRepository.getRecord(customerCode);

        if (existingCustomer != null && customerCode.equals(updatedCustomer.getCustomerCode())) {
            customerRepository.updateRecord(updatedCustomer);
        } else {
            throw new IllegalArgumentException("Customer с кодом " + updatedCustomer.getCustomerCode() + " не найден");
        }
        return customerRepository.getRecord(updatedCustomer.getCustomerCode());
    }

    @Transactional
    @Override
    public Page<CustomerDTO> getListOfCustomers(CustomerFilterRequest customerFilter, Pageable pageable) {
        return customerRepository.getAllRecordsWithFilter(customerFilter, pageable);
    }

    @Override
    public List<CustomerSimpleDTO> getCustomersSimpleList() {
        return customerRepository.getRecordsSimpleList();
    }
}
