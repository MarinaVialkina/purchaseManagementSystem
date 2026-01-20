package com.example.customer.controller;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.dto.request.CustomerFilterRequest;
import com.example.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/customers")
public class CustomerController {
    @Autowired
    CustomerService customerService;

    @PostMapping
    public CustomerDTO addCustomer(@RequestBody CustomerDTO newCustomer){
        return customerService.addCustomer(newCustomer);
    }

    @DeleteMapping("/{customerCode}")
    public void deleteCustomer(@PathVariable String customerCode){
        customerService.deleteCustomer(customerCode);
    }

    @PutMapping("/{customerCode}")
    public CustomerDTO updateCustomer(@PathVariable String customerCode, @RequestBody CustomerDTO updatedCustomer){
        return customerService.updateCustomer(customerCode, updatedCustomer);
    }

    @GetMapping("")
    public Page<CustomerDTO> getListOfCustomers(
            @ModelAttribute CustomerFilterRequest customerFilter, Pageable pageable){
        return customerService.getListOfCustomers(customerFilter, pageable);
    }
}
