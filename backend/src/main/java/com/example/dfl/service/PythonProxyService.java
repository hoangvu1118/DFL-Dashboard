package com.example.dfl.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import com.example.dfl.dto.*;

@Service
public class PythonProxyService {

    private final WebClient webClient;

    public PythonProxyService(@Value("${python.bootstrap-url}") String bootstrapUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(bootstrapUrl)
                .build();
    }

    public Mono<AdjacencyResponse> getAdjacency() {
        return webClient.get()
                .uri("/graph")
                .retrieve()
                .bodyToMono(AdjacencyResponse.class);
    }

    public Mono<StatusResponse> getNodeStatus(String host, String gossipPort) {
        String url = String.format("http://%s:%s/status", host, gossipPort);
        return WebClient.create(url)
                .get()
                .retrieve()
                .bodyToMono(StatusResponse.class);
    }

    public Mono<PredictResponse> postPredict(String host, String gossipPort, PredictRequest payload) {
        String url = String.format("http://%s:%s/predict", host, gossipPort);
        java.util.Map<String, String> body = java.util.Map.of("message", payload.getSymptoms() != null ? payload.getSymptoms() : "");
        return WebClient.create(url)
                .post()
                .bodyValue(body)
                .retrieve()
                .bodyToMono(java.util.Map.class)
                .map(res -> {
                    PredictResponse response = new PredictResponse();
                    if (res != null && res.containsKey("response")) {
                        response.setDiagnosis(String.valueOf(res.get("response")));
                    } else {
                        response.setDiagnosis("Error: Invalid response from Python node");
                    }
                    return response;
                });
    }

    // New method: sends prediction request directly to the bootstrap server
    public Mono<PredictResponse> postBootstrapPredict(PredictRequest payload) {
        java.util.Map<String, String> body = java.util.Map.of("message", payload.getSymptoms() != null ? payload.getSymptoms() : "");
        return webClient.post()
                .uri("/predict")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(java.util.Map.class)
                .map(res -> {
                    PredictResponse response = new PredictResponse();
                    if (res != null && res.containsKey("response")) {
                        response.setDiagnosis(String.valueOf(res.get("response")));
                    } else {
                        response.setDiagnosis("Error: Invalid response from Python bootstrap server");
                    }
                    return response;
                });
    }
}
