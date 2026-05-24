package com.vgu.backend.repository;

import com.vgu.backend.domain.Node;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NodeRepository extends JpaRepository<Node,String> {
    boolean existsByNodeId(String nodeId);

    Node findByNodeId(String nodeId);
}
