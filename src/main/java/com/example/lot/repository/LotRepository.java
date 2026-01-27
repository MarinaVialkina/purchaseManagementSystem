package com.example.lot.repository;

import com.example.lot.dto.LotDTO;
import com.example.lot.dto.request.LotFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface LotRepository {
    void addRecord(LotDTO newLot);

    void deleteRecord(String lotName);

    void updateRecord(LotDTO updatedLot);

    LotDTO getRecord(String lotName);

    Page<LotDTO> getAllRecordWithFilter(LotFilterRequest lotFilterRequest, Pageable pageable);
}
