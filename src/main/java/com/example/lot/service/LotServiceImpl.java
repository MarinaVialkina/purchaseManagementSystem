package com.example.lot.service;

import com.example.lot.dto.LotDTO;
import com.example.lot.dto.request.LotFilterRequest;
import com.example.lot.repository.LotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LotServiceImpl implements LotService{
    @Autowired
    LotRepository lotRepository;

    @Transactional
    @Override
    public LotDTO addLot(LotDTO newLot) {
        LotDTO existingLot = lotRepository.getRecord(newLot.getLotName());
        if (existingLot == null){
            lotRepository.addRecord(newLot);
        }else{
            throw new IllegalArgumentException("Lot с именем " + newLot.getLotName() + " уже существует");
        }

        return lotRepository.getRecord(newLot.getLotName());
    }

    @Transactional
    @Override
    public void deleteLot(String lotName) {
        lotRepository.deleteRecord(lotName);
    }

    @Transactional
    @Override
    public LotDTO updateLot(String lotName, LotDTO updatedLot) {
        LotDTO existingLot = lotRepository.getRecord(lotName);
        if (existingLot != null && lotName.equals(updatedLot.getLotName())){
            lotRepository.updateRecord(updatedLot);
        }else {
            throw new IllegalArgumentException("Lot с именем " + updatedLot.getLotName() + " не найден");
        }

        return lotRepository.getRecord(updatedLot.getLotName());
    }

    @Transactional
    @Override
    public Page<LotDTO> getListOfLots(LotFilterRequest lotFilterRequest, Pageable pageable) {
        return lotRepository.getAllRecordWithFilter(lotFilterRequest, pageable);
    }
}
