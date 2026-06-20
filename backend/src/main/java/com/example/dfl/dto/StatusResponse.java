package com.example.dfl.dto;

import lombok.Data;

@Data
public class StatusResponse {
    private String node_id;
    private String phase;
    private int round;
    private java.util.Set<String> neighbor_map;
    private String ring_left;
    private String ring_right;
}
