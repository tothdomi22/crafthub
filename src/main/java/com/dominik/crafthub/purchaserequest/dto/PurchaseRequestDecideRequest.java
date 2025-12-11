package com.dominik.crafthub.purchaserequest.dto;

import com.dominik.crafthub.purchaserequest.entity.PurchaseRequestPatchStatusEnum;
import jakarta.validation.constraints.NotNull;

public record PurchaseRequestDecideRequest(
    @NotNull(message = "This field cannot be blank") PurchaseRequestPatchStatusEnum status) {}
