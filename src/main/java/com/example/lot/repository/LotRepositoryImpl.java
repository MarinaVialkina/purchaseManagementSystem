package com.example.lot.repository;

import com.example.jooq.tables.records.LotRecord;
import com.example.lot.dto.LotDTO;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

import static com.example.jooq.tables.Lot.LOT;

public class LotRepositoryImpl implements LotRepository{
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
        assert lotRecord != null;
        return new LotDTO(lotRecord.getLotName(),
                lotRecord.getCustomerCode(),
                lotRecord.getPrice(),
                lotRecord.getCurrencyCode(),
                lotRecord.getNdsRate(),
                lotRecord.getPlaceDelivery(),
                lotRecord.getDateDelivery());
    }

    @Override
    public List<LotDTO> getAllRecord() {
        List<LotRecord> lotRecords = dslContext.selectFrom(LOT).fetch();
        List<LotDTO> allLotDTO = new ArrayList<>();
        for (LotRecord lotRecord : lotRecords){
            allLotDTO.add(new LotDTO(lotRecord.getLotName(),
                    lotRecord.getCustomerCode(),
                    lotRecord.getPrice(),
                    lotRecord.getCurrencyCode(),
                    lotRecord.getNdsRate(),
                    lotRecord.getPlaceDelivery(),
                    lotRecord.getDateDelivery()));
        }
        return allLotDTO;
    }
}
