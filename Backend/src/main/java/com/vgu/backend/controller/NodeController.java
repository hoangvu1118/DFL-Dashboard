package com.vgu.backend.controller;

import com.vgu.backend.domain.dto.DataReportRequest;
import com.vgu.backend.domain.dto.DataReportResponse;
import com.vgu.backend.service.DataReportService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Data
@RequestMapping("/api/report")
@RestController
@AllArgsConstructor
public class NodeController {
    private DataReportService dataReportService;

    @PatchMapping
    public ResponseEntity<DataReportResponse> receiveReportData(@RequestBody DataReportRequest request) {
        DataReportResponse response = dataReportService.updateNode(request);
        return ResponseEntity.ok(response);
    }
}
