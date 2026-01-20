package com.example.lot.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LotFilterRequest {
    private String lotName;
    private String customerCode;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String currencyCode;
    private String ndsRate;
    private String placeDelivery;
    private LocalDateTime dateDeliveryFrom;
    private LocalDateTime dateDeliveryTo;

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

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
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

    public LocalDateTime getDateDeliveryFrom() {
        return dateDeliveryFrom;
    }

    public void setDateDeliveryFrom(LocalDateTime dateDeliveryFrom) {
        this.dateDeliveryFrom = dateDeliveryFrom;
    }

    public LocalDateTime getDateDeliveryTo() {
        return dateDeliveryTo;
    }

    public void setDateDeliveryTo(LocalDateTime dateDeliveryTo) {
        this.dateDeliveryTo = dateDeliveryTo;
    }
}
