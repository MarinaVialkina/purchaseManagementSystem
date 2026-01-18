package com.example.lot.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LotDTO {
    private final String lotName;
    private final String customerCode;
    private final BigDecimal price;
    private final String currencyCode;
    private final String ndsRate;
    private final String placeDelivery;
    private final LocalDateTime dateDelivery;

    public LotDTO(String lotName, String customerCode, BigDecimal price, String currencyCode, String ndsRate,
                  String placeDelivery, LocalDateTime dateDelivery) {
        this.lotName = lotName;
        this.customerCode = customerCode;
        this.price = price;
        this.currencyCode = currencyCode;
        this.ndsRate = ndsRate;
        this.placeDelivery = placeDelivery;
        this.dateDelivery = dateDelivery;
    }

    public String getLotName() {
        return lotName;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public String getNdsRate() {
        return ndsRate;
    }

    public String getPlaceDelivery() {
        return placeDelivery;
    }

    public LocalDateTime getDateDelivery() {
        return dateDelivery;
    }
}
