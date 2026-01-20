package com.example.lot.controller;

import com.example.lot.dto.LotDTO;
import com.example.lot.dto.request.LotFilterRequest;
import com.example.lot.service.LotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/lots")
public class LotController {
    @Autowired
    LotService lotService;

    @PostMapping
    public LotDTO addLot(@RequestBody LotDTO newLot){
        return lotService.addLot(newLot);
    }

    @DeleteMapping("/{lotName}")
    public void deleteLot(@PathVariable String lotName){
        lotService.deleteLot(lotName);
    }

    @PutMapping("/{lotName}")
    public LotDTO updateLot(@PathVariable String lotName, @RequestBody LotDTO updatedLot){
        return lotService.updateLot(lotName, updatedLot);
    }

    @GetMapping("")
    public Page<LotDTO> getListOfLots(
            @ModelAttribute LotFilterRequest lotFilter, Pageable pageable){
        return lotService.getListOfLots(lotFilter, pageable);
    }
}
