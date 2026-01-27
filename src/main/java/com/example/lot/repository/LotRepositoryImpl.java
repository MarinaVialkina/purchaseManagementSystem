package com.example.lot.repository;

import com.example.jooq.tables.records.LotRecord;
import com.example.lot.dto.LotDTO;
import com.example.lot.dto.request.LotFilterRequest;
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

import static com.example.jooq.tables.Lot.LOT;

@Repository
public class LotRepositoryImpl implements LotRepository {
    @Autowired
    private DSLContext dslContext;

    @Override
    public void addRecord(LotDTO newLot) {
        dslContext.insertInto(LOT)
                .set(LOT.LOT_NAME, newLot.getLotName())
                .set(LOT.CUSTOMER_CODE, newLot.getCustomerCode())
                .set(LOT.PRICE, newLot.getPrice())
                .set(LOT.CURRENCY_CODE, newLot.getCurrencyCode())
                .set(LOT.NDS_RATE, newLot.getNdsRate())
                .set(LOT.PLACE_DELIVERY, newLot.getPlaceDelivery())
                .set(LOT.DATE_DELIVERY, newLot.getDateDelivery())
                .execute();

    }

    @Override
    public void deleteRecord(String lotName) {
        dslContext.deleteFrom(LOT)
                .where(LOT.LOT_NAME.eq(lotName)).execute();
    }

    @Override
    public void updateRecord(LotDTO updatedLot) {
        dslContext.update(LOT)
                .set(LOT.CUSTOMER_CODE, updatedLot.getCustomerCode())
                .set(LOT.PRICE, updatedLot.getPrice())
                .set(LOT.CURRENCY_CODE, updatedLot.getCurrencyCode())
                .set(LOT.NDS_RATE, updatedLot.getNdsRate())
                .set(LOT.PLACE_DELIVERY, updatedLot.getPlaceDelivery())
                .set(LOT.DATE_DELIVERY, updatedLot.getDateDelivery())
                .where(LOT.LOT_NAME.eq(updatedLot.getLotName()))
                .execute();
    }

    @Override
    public LotDTO getRecord(String lotName) {
        LotRecord lotRecord = dslContext.selectFrom(LOT).where(LOT.LOT_NAME.eq(lotName)).fetchOne();
        if (lotRecord == null) {
            return null;
        }

        return new LotDTO(lotRecord.getLotName(),
                lotRecord.getCustomerCode(),
                lotRecord.getPrice(),
                lotRecord.getCurrencyCode(),
                lotRecord.getNdsRate(),
                lotRecord.getPlaceDelivery(),
                lotRecord.getDateDelivery());
    }

    @Override
    public Page<LotDTO> getAllRecordWithFilter(LotFilterRequest lotFilterRequest, Pageable pageable) {
        Condition condition = DSL.noCondition();

        if (lotFilterRequest.getLotName() != null && !lotFilterRequest.getLotName().isEmpty()) {
            condition = condition.and(LOT.LOT_NAME.likeIgnoreCase("%" + lotFilterRequest.getLotName() + "%"));
        }
        if (lotFilterRequest.getCustomerCode() != null && !lotFilterRequest.getCustomerCode().isEmpty()) {
            condition = condition.and(LOT.CUSTOMER_CODE.eq(lotFilterRequest.getCustomerCode()));
        }
        if (lotFilterRequest.getMinPrice() != null) {
            condition = condition.and(LOT.PRICE.ge(lotFilterRequest.getMinPrice()));
        }
        if (lotFilterRequest.getMaxPrice() != null) {
            condition = condition.and(LOT.PRICE.le(lotFilterRequest.getMaxPrice()));
        }
        if (lotFilterRequest.getCurrencyCode() != null && !lotFilterRequest.getCurrencyCode().isEmpty()) {
            condition = condition.and(LOT.CURRENCY_CODE.eq(lotFilterRequest.getCurrencyCode()));
        }
        if (lotFilterRequest.getNdsRate() != null && !lotFilterRequest.getNdsRate().isEmpty()) {
            condition = condition.and(LOT.NDS_RATE.eq(lotFilterRequest.getNdsRate()));
        }
        if (lotFilterRequest.getPlaceDelivery() != null && !lotFilterRequest.getPlaceDelivery().isEmpty()) {
            condition = condition.and(LOT.PLACE_DELIVERY.likeIgnoreCase("%" + lotFilterRequest.getPlaceDelivery() + "%"));
        }
        if (lotFilterRequest.getDateDeliveryFrom() != null) {
            condition = condition.and(LOT.DATE_DELIVERY.ge(lotFilterRequest.getDateDeliveryFrom()));
        }
        if (lotFilterRequest.getDateDeliveryTo() != null) {
            condition = condition.and(LOT.DATE_DELIVERY.le(lotFilterRequest.getDateDeliveryTo()));
        }

        SortField<?>[] sortFields = getSortFields(pageable);

        int totalCountOfRecord = dslContext.selectCount()
                .from(LOT)
                .where(condition)
                .fetchOne(0, int.class);

        List<LotDTO> content = dslContext.selectFrom(LOT)
                .where(condition)
                .orderBy(sortFields)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset())
                .fetch(this::mapToDTO);

        return new PageImpl<>(content, pageable, totalCountOfRecord);
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
            sortFields.add(LOT.LOT_NAME.asc());
        }

        return sortFields.toArray(new SortField<?>[0]);
    }

    private Field<?> getField(String propertyName) {
        return switch (propertyName) {
            case "lotName" -> LOT.LOT_NAME;
            case "customerCode" -> LOT.CUSTOMER_CODE;
            case "price" -> LOT.PRICE;
            case "currencyCode" -> LOT.CURRENCY_CODE;
            case "ndsRate" -> LOT.NDS_RATE;
            case "placeDelivery" -> LOT.PLACE_DELIVERY;
            case "dateDelivery" -> LOT.DATE_DELIVERY;
            default -> null;
        };
    }

    private LotDTO mapToDTO(Record record) {
        return new LotDTO(record.get(LOT.LOT_NAME),
                record.get(LOT.CUSTOMER_CODE),
                record.get(LOT.PRICE),
                record.get(LOT.CURRENCY_CODE),
                record.get(LOT.NDS_RATE),
                record.get(LOT.PLACE_DELIVERY),
                record.get(LOT.DATE_DELIVERY));
    }
}
