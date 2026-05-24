package com.vgu.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DataReportRequest {
    @JsonProperty("node_id")
    private String nodeId;
    private String status;
    private int round;
    private String timestamp;
}
