package com.example.customer.repository;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.dto.CustomerSimpleDTO;
import com.example.customer.dto.request.CustomerFilterRequest;
import com.example.jooq.tables.records.CustomerRecord;
import org.jooq.*;
import org.jooq.Record;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

import static com.example.jooq.tables.Customer.CUSTOMER;


@Repository
public class CustomerRepositoryImpl implements CustomerRepository {
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
                .set(CUSTOMER.CUSTOMER_CODE_MAIN, newCustomer.customerCodeMain)
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
        if (customerRecord == null) {
            return null;
        }
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
    public Page<CustomerDTO> getAllRecordsWithFilter(CustomerFilterRequest filter, Pageable pageable) {
        Condition condition = DSL.noCondition();

        if (filter != null) {
            if (filter.getCustomerName() != null && !filter.getCustomerName().isEmpty()) {
                condition = condition.and(CUSTOMER.CUSTOMER_NAME.likeIgnoreCase("%" + filter.getCustomerName() + "%"));
            }
            if (filter.getCustomerInn() != null && !filter.getCustomerInn().isEmpty()) {
                condition = condition.and(CUSTOMER.CUSTOMER_INN.eq(filter.getCustomerInn()));
            }
            if (filter.getCustomerKpp() != null && !filter.getCustomerKpp().isEmpty()) {
                condition = condition.and(CUSTOMER.CUSTOMER_KPP.eq(filter.getCustomerKpp()));
            }
            if (filter.getCustomerLegalAddress() != null && !filter.getCustomerLegalAddress().isEmpty()) {
                condition = condition.and(CUSTOMER.CUSTOMER_LEGAL_ADDRESS.likeIgnoreCase("%" + filter.getCustomerLegalAddress() + "%"));
            }
            if (filter.getCustomerPostalAddress() != null && !filter.getCustomerPostalAddress().isEmpty()) {
                condition = condition.and(CUSTOMER.CUSTOMER_POSTAL_ADDRESS.likeIgnoreCase("%" + filter.getCustomerPostalAddress() + "%"));
            }
            if (filter.getCustomerEmail() != null && !filter.getCustomerEmail().isEmpty()) {
                condition = condition.and(CUSTOMER.CUSTOMER_EMAIL.likeIgnoreCase("%" + filter.getCustomerEmail() + "%"));
            }
            if (filter.getCustomerCodeMain() != null && !filter.getCustomerCodeMain().isEmpty()) {
                condition = condition.and(CUSTOMER.CUSTOMER_CODE_MAIN.eq(filter.getCustomerCodeMain()));
            }
            if (filter.isOrganization() != null) {
                condition = condition.and(CUSTOMER.IS_ORGANIZATION.eq(filter.isOrganization()));
            }
            if (filter.isPerson() != null) {
                condition = condition.and(CUSTOMER.IS_PERSON.eq(filter.isPerson()));
            }
        }
        SortField<?>[] sortFields = getSortFields(pageable);

        int totalNumberOfRecords = dslContext.selectCount()
                .from(CUSTOMER)
                .where(condition)
                .fetchOne(0, int.class);

        List<CustomerDTO> content = dslContext.selectFrom(CUSTOMER)
                .where(condition)
                .orderBy(sortFields)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset())
                .fetch(this::mapToDTO);

        return new PageImpl<>(content, pageable, totalNumberOfRecords);
    }

    @Override
    public List<CustomerSimpleDTO> getRecordsSimpleList() {
        return dslContext.select(CUSTOMER.CUSTOMER_CODE, CUSTOMER.CUSTOMER_NAME)
                .from(CUSTOMER)
                .orderBy(CUSTOMER.CUSTOMER_NAME.asc())
                .fetch()
                .map(record -> new CustomerSimpleDTO(
                        record.get(CUSTOMER.CUSTOMER_CODE),
                        record.get(CUSTOMER.CUSTOMER_NAME)
                ));
    }

    private SortField<?>[] getSortFields(Pageable pageable) {
        List<SortField<?>> sortFields = new ArrayList<>();
        if (pageable.getSort() != null) {
            pageable.getSort().forEach(order -> {
                Field<?> field = getField(order.getProperty());
                if (field != null) {
                    sortFields.add(order.isAscending() ? field.asc() : field.desc());
                }
            });
        }

        if (sortFields.isEmpty()) {
            sortFields.add(CUSTOMER.CUSTOMER_CODE.asc());
        }

        return sortFields.toArray(new SortField<?>[0]);
    }

    private Field<?> getField(String propertyName) {
        return switch (propertyName) {
            case "customerName" -> CUSTOMER.CUSTOMER_NAME;
            case "customerInn" -> CUSTOMER.CUSTOMER_INN;
            case "customerKpp" -> CUSTOMER.CUSTOMER_KPP;
            case "customerLegalAddress" -> CUSTOMER.CUSTOMER_LEGAL_ADDRESS;
            case "customerPostalAddress" -> CUSTOMER.CUSTOMER_POSTAL_ADDRESS;
            case "customerEmail" -> CUSTOMER.CUSTOMER_EMAIL;
            case "customerCodeMain" -> CUSTOMER.CUSTOMER_CODE_MAIN;
            case "isOrganization" -> CUSTOMER.IS_ORGANIZATION;
            case "isPerson" -> CUSTOMER.IS_PERSON;
            default -> null;
        };
    }

    private CustomerDTO mapToDTO(Record record) {
        return new CustomerDTO(
                record.get(CUSTOMER.CUSTOMER_CODE),
                record.get(CUSTOMER.CUSTOMER_NAME),
                record.get(CUSTOMER.CUSTOMER_INN),
                record.get(CUSTOMER.CUSTOMER_KPP),
                record.get(CUSTOMER.CUSTOMER_LEGAL_ADDRESS),
                record.get(CUSTOMER.CUSTOMER_POSTAL_ADDRESS),
                record.get(CUSTOMER.CUSTOMER_EMAIL),
                record.get(CUSTOMER.CUSTOMER_CODE_MAIN),
                record.get(CUSTOMER.IS_ORGANIZATION),
                record.get(CUSTOMER.IS_PERSON)
        );
    }
}
