package com.example.lot.repository;

import com.example.lot.dto.LotDTO;

import java.util.List;

public interface LotRepository {
    void addRecord(LotDTO newLot);
    void deleteRecord(String lotName);
    void updateRecord(LotDTO updatedLot);
    LotDTO getRecord(String lotName);
    List<LotDTO> getAllRecord();
}
