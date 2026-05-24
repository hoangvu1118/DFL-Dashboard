package com.vgu.backend.controller;

import com.vgu.backend.domain.dto.DataRegisterRequest;
import com.vgu.backend.domain.dto.DataRegisterResponse;
import com.vgu.backend.repository.NodeRepository;
import com.vgu.backend.service.DataReportService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/report/register")
@Data
@AllArgsConstructor
public class RegisterController {
    private DataReportService dataReportService;

    @PostMapping
    public ResponseEntity<DataRegisterResponse> registerNode(@RequestBody DataRegisterRequest request){
        DataRegisterResponse response = dataReportService.register(request);
        return ResponseEntity.ok(response);
    }
}
