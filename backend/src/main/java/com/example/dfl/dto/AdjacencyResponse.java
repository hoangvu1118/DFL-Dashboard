package com.example.dfl.dto;

import java.util.Map;
import java.util.List;
import lombok.Data;

@Data
public class AdjacencyResponse {
    private Map<String, List<String>> adjacency;
    private Map<String, Integer> degrees;
    private boolean is_k_regular;
}
