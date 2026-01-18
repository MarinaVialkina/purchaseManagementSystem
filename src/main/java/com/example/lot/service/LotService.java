package com.example.lot.service;


import com.example.lot.dto.LotDTO;

public interface LotService {
    void addLot(LotDTO newLot);
    void deleteLot(String lotName);
    void updateLot(LotDTO updatedLot);
}
