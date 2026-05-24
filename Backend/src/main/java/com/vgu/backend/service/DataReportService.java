package com.vgu.backend.service;

import com.vgu.backend.domain.Node;
import com.vgu.backend.domain.dto.DataRegisterRequest;
import com.vgu.backend.domain.dto.DataRegisterResponse;
import com.vgu.backend.domain.dto.DataReportRequest;
import com.vgu.backend.domain.dto.DataReportResponse;
import com.vgu.backend.exception.NodeExistsException;
import com.vgu.backend.exception.NodeNotFoundException;
import com.vgu.backend.repository.NodeRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

@Data
@AllArgsConstructor
@Service
public class DataReportService {
    private NodeRepository nodeRepository;

    public DataRegisterResponse register(DataRegisterRequest request){
        if(nodeRepository.existsByNodeId(request.getNodeId())){
            throw new NodeExistsException("Node already exists!");
        }
        Node node = new Node();
        node.setNodeId(request.getNodeId());
        node.setNodeName("Node "+request.getNodeId());
        node.setIpAddress(request.getIpAddress());
        node.setPort(request.getPort());

        Node saveNode = nodeRepository.save(node);
        DataRegisterResponse response = new DataRegisterResponse();
        response.setNodeId(saveNode.getNodeId());

        return response;
    }

    public DataReportResponse updateNode(DataReportRequest request){
        if(!nodeRepository.existsByNodeId(request.getNodeId())){
            throw new NodeNotFoundException("Node not found!");
        }
        Node node = nodeRepository.findByNodeId(request.getNodeId());
        node.setStatus(request.getStatus());
        node.setRound(request.getRound());

        Node saveNode = nodeRepository.save(node);
        DataReportResponse response = new DataReportResponse();
        response.setNodeId(saveNode.getNodeId());
        return response;
    }
}
