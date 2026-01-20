package com.example.lot.service;

import com.example.lot.dto.LotDTO;
import com.example.lot.repository.LotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LotServiceImpl implements LotService{
    @Autowired
    LotRepository lotRepository;

    @Override
    public void addLot(LotDTO newLot) {
        if (lotRepository.getRecord(newLot.getLotName()) != null){
            lotRepository.addRecord(newLot);
        }else{
            System.out.println("Имя lot занят");
        }
    }

    @Override
    public void deleteLot(String lotName) {
        lotRepository.deleteRecord(lotName);
    }

    @Override
    public void updateLot(LotDTO updatedLot) {
        if (lotRepository.getRecord(updatedLot.getLotName())!= null){
            lotRepository.updateRecord(updatedLot);
        }else {
            System.out.println("Lot с таким именем не найден");
        }
    }
}
