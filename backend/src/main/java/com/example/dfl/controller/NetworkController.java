package com.example.dfl.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dfl.dto.*;
import com.example.dfl.service.PythonProxyService;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class NetworkController {

    private final PythonProxyService proxy;

    public NetworkController(PythonProxyService proxy) {
        this.proxy = proxy;
    }

    @GetMapping("/adjacency")
    public Mono<ResponseEntity<AdjacencyResponse>> adjacency() {
        return proxy.getAdjacency()
                .map(ResponseEntity::ok);
    }

    @GetMapping("/node/{nodeId}/status")
    public Mono<ResponseEntity<StatusResponse>> nodeStatus(@PathVariable String nodeId) {
        String[] parts = nodeId.split(":");
        if (parts.length < 2) {
            return Mono.just(ResponseEntity.badRequest().build());
        }
        String host = parts[0];
        String gossipPort = parts[1];
        return proxy.getNodeStatus(host, gossipPort)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/node/{nodeId}/predict")
    public Mono<ResponseEntity<PredictResponse>> nodePredict(
            @PathVariable String nodeId,
            @RequestBody PredictRequest request) {

        String[] parts = nodeId.split(":");
        if (parts.length != 3) {
            return Mono.just(ResponseEntity.badRequest().build());
        }
        String host = parts[0];
        String gossipPort = parts[1];
        return proxy.postPredict(host, gossipPort, request)
                .map(ResponseEntity::ok);
    }
}
