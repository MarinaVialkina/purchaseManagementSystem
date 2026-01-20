package com.example.lot.service;


import com.example.lot.dto.LotDTO;
import com.example.lot.dto.request.LotFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LotService {
    LotDTO addLot(LotDTO newLot);
    void deleteLot(String lotName);
    LotDTO updateLot(String lotName, LotDTO updatedLot);

    Page<LotDTO> getListOfLots(LotFilterRequest lotFilterRequest, Pageable pageable);
}
