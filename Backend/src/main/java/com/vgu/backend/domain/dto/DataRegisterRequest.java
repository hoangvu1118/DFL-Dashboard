package com.vgu.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DataRegisterRequest {
    @JsonProperty("node_id")
    private String nodeId;
    @JsonProperty("ip_address")
    private String ipAddress;
    private String port;
}
