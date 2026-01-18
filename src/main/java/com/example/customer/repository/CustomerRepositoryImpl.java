package com.example.customer.repository;

import com.example.customer.dto.CustomerDTO;
import com.example.jooq.tables.records.CustomerRecord;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static com.example.jooq.tables.Customer.CUSTOMER;

@Repository
public class CustomerRepositoryImpl implements CustomerRepository{
    @Autowired
    private DSLContext dslContext;
    @Override
    public void addRecord(CustomerDTO newCustomer) {
        dslContext.insertInto(CUSTOMER)
                .set(CUSTOMER.CUSTOMER_CODE, newCustomer.getCustomerCode())
                .set(CUSTOMER.CUSTOMER_NAME, newCustomer.getCustomerName())
                .set(CUSTOMER.CUSTOMER_INN, newCustomer.getCustomerInn())
                .set(CUSTOMER.CUSTOMER_KPP, newCustomer.getCustomerKpp())
                .set(CUSTOMER.CUSTOMER_LEGAL_ADDRESS, newCustomer.getCustomerLegalAddress())
                .set(CUSTOMER.CUSTOMER_POSTAL_ADDRESS, newCustomer.getCustomerPostalAddress())
                .set(CUSTOMER.CUSTOMER_EMAIL, newCustomer.getCustomerEmail())
                .set(CUSTOMER.CUSTOMER_CODE_MAIN, newCustomer.getCustomerCodeMain())
                .set(CUSTOMER.IS_ORGANIZATION, newCustomer.isOrganization())
                .set(CUSTOMER.IS_PERSON, newCustomer.isPerson())
                .execute();
    }

    @Override
    public void deleteRecord(String customer_code) {
        dslContext.deleteFrom(CUSTOMER).where(CUSTOMER.CUSTOMER_CODE.eq(customer_code)).execute();
    }

    @Override
    public void updateRecord(CustomerDTO updatedCustomer) {
        dslContext.update(CUSTOMER)
                .set(CUSTOMER.CUSTOMER_NAME, updatedCustomer.getCustomerName())
                .set(CUSTOMER.CUSTOMER_INN, updatedCustomer.getCustomerInn())
                .set(CUSTOMER.CUSTOMER_KPP, updatedCustomer.getCustomerKpp())
                .set(CUSTOMER.CUSTOMER_LEGAL_ADDRESS, updatedCustomer.getCustomerLegalAddress())
                .set(CUSTOMER.CUSTOMER_POSTAL_ADDRESS, updatedCustomer.getCustomerPostalAddress())
                .set(CUSTOMER.CUSTOMER_EMAIL, updatedCustomer.getCustomerEmail())
                .set(CUSTOMER.CUSTOMER_CODE_MAIN, updatedCustomer.getCustomerCodeMain())
                .set(CUSTOMER.IS_ORGANIZATION, updatedCustomer.isOrganization())
                .set(CUSTOMER.IS_PERSON, updatedCustomer.isPerson())
                .where(CUSTOMER.CUSTOMER_CODE.eq(updatedCustomer.getCustomerCode()))
                .execute();
    }

    @Override
    public CustomerDTO getRecord(String customer_code) {
        CustomerRecord customerRecord = dslContext.selectFrom(CUSTOMER)
                .where(CUSTOMER.CUSTOMER_CODE.eq(customer_code))
                .fetchOne();

        assert customerRecord != null;
        return new CustomerDTO(customerRecord.getCustomerCode(),
                customerRecord.getCustomerName(),
                customerRecord.getCustomerInn(),
                customerRecord.getCustomerKpp(),
                customerRecord.getCustomerLegalAddress(),
                customerRecord.getCustomerPostalAddress(),
                customerRecord.getCustomerEmail(),
                customerRecord.getCustomerCodeMain(),
                customerRecord.getIsOrganization(),
                customerRecord.getIsPerson());
    }

    @Override
    public List<CustomerDTO> getAllRecord() {
        List<CustomerRecord> customerRecords = dslContext.selectFrom(CUSTOMER).fetch();
        List<CustomerDTO> allCustomerDTO = new ArrayList<>();
        for (CustomerRecord customerRecord : customerRecords){
            allCustomerDTO.add(new CustomerDTO(customerRecord.getCustomerCode(),
                    customerRecord.getCustomerName(),
                    customerRecord.getCustomerInn(),
                    customerRecord.getCustomerKpp(),
                    customerRecord.getCustomerLegalAddress(),
                    customerRecord.getCustomerPostalAddress(),
                    customerRecord.getCustomerEmail(),
                    customerRecord.getCustomerCodeMain(),
                    customerRecord.getIsOrganization(),
                    customerRecord.getIsPerson()));
        }
        return allCustomerDTO;
    }
}
