package com.example.customer.service;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl implements CustomerService{
    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public void addCustomer(CustomerDTO newCustomer) {
        if (customerRepository.getRecord(newCustomer.getCustomerCode()) != null){
            customerRepository.addRecord(newCustomer);
        }else{
            System.out.println("Код customer занят");
        }
    }

    @Override
    public void deleteCustomer(String customerCode) {
        customerRepository.deleteRecord(customerCode);
    }

    @Override
    public void updateCustomer(CustomerDTO updatedCustomer) {
        if (customerRepository.getRecord(updatedCustomer.getCustomerCode())!= null){
            customerRepository.updateRecord(updatedCustomer);
        }else {
            System.out.println("Customer с таким кодом не найден");
        }
    }
}
