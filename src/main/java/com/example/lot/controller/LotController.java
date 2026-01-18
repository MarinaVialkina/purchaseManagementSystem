package com.example.lot.controller;

import com.example.customer.dto.CustomerDTO;
import com.example.customer.service.CustomerService;
import com.example.lot.dto.LotDTO;
import com.example.lot.service.LotService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/lots")
public class LotController {
    private final LotService lotService;

    public LotController(LotService lotService) {
        this.lotService = lotService;
    }

    @PostMapping
    public void addLot(String lotName, String customerCode, BigDecimal price, String currencyCode, String ndsRate,
                       String placeDelivery, LocalDateTime dateDelivery){
        LotDTO lotDTO = new LotDTO(lotName, customerCode, price, currencyCode, ndsRate, placeDelivery, dateDelivery);
        lotService.addLot(lotDTO);
    }

    @DeleteMapping("/{lotName}")
    public void deleteLot(@PathVariable String lotName){
        lotService.deleteLot(lotName);
    }

    @PostMapping("/{lotName}")
    public void updateCustomer(@PathVariable String lotName, String customerCode, BigDecimal price, String currencyCode, String ndsRate,
                               String placeDelivery, LocalDateTime dateDelivery){
        LotDTO updatedLot = new LotDTO(lotName, customerCode, price, currencyCode, ndsRate, placeDelivery, dateDelivery);
        lotService.updateLot(updatedLot);
    }
}
