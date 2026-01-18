package com.example.customer.controller;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.service.CustomerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public void addCustomer( String customerCode, String customerName, String customerInn, String customerKpp,
                            String customerLegalAddress, String customerPostalAddress, String customerEmail,
                            String customerCodeMain, boolean isOrganization, boolean isPerson){
        CustomerDTO customerDTO = new CustomerDTO(customerCode, customerName, customerInn, customerKpp, customerLegalAddress,
                customerPostalAddress, customerEmail, customerCodeMain, isOrganization, isPerson);
        customerService.addCustomer(customerDTO);
    }

    @DeleteMapping("/{customerCode}")
    public void deleteCustomer(@PathVariable String customerCode){
        customerService.deleteCustomer(customerCode);
    }

    @PostMapping("/{customerCode}")
    public void updateCustomer(@PathVariable String customerCode, String customerName, String customerInn, String customerKpp,
                               String customerLegalAddress, String customerPostalAddress, String customerEmail,
                               String customerCodeMain, boolean isOrganization, boolean isPerson){
        CustomerDTO updatedCustomer = new CustomerDTO(customerCode, customerName, customerInn, customerKpp, customerLegalAddress,
                customerPostalAddress, customerEmail, customerCodeMain, isOrganization, isPerson);
        customerService.updateCustomer(updatedCustomer);
    }
}
