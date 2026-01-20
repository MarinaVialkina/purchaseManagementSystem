package com.example.lot.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LotDTO {
    @NotBlank(message = "Поле lotName не заполнено")
    public String lotName;
    public String customerCode;
    public BigDecimal price;
    public String currencyCode;
    public String ndsRate;
    public String placeDelivery;
    public LocalDateTime dateDelivery;

    public LotDTO() {
    }

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

    public void setLotName(String lotName) {
        this.lotName = lotName;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getNdsRate() {
        return ndsRate;
    }

    public void setNdsRate(String ndsRate) {
        this.ndsRate = ndsRate;
    }

    public String getPlaceDelivery() {
        return placeDelivery;
    }

    public void setPlaceDelivery(String placeDelivery) {
        this.placeDelivery = placeDelivery;
    }

    public LocalDateTime getDateDelivery() {
        return dateDelivery;
    }

    public void setDateDelivery(LocalDateTime dateDelivery) {
        this.dateDelivery = dateDelivery;
    }
}
