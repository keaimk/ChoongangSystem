package com.example.backend.service.standard.franchise;

import com.example.backend.dto.standard.franchise.Franchise;
import com.example.backend.mapper.standard.franchise.FranchiseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class FranchiseService {

    final FranchiseMapper mapper;

    // 필드 유효성 확인
    public boolean validate(Franchise franchise) {
        boolean franchiseNameValid = franchise.getFranchiseName() != null && !franchise.getFranchiseName().trim().isEmpty();
        boolean franchiseRepValid = franchise.getFranchiseRep() != null && !franchise.getFranchiseRep().trim().isEmpty();
        boolean franchiseNoValid = franchise.getFranchiseNo() != null && !franchise.getFranchiseNo().trim().isEmpty();
        boolean franchiseTelValid = franchise.getFranchiseTel() != null && !franchise.getFranchiseTel().trim().isEmpty();
        boolean franchiseAddressValid = franchise.getFranchiseAddress() != null && !franchise.getFranchiseAddress().trim().isEmpty();
        boolean franchisePostValid = franchise.getFranchisePost() != null && !franchise.getFranchisePost().trim().isEmpty();
        boolean franchiseStateValid = franchise.getFranchiseState() != null && !franchise.getFranchiseState().trim().isEmpty();
        boolean franchiseCityValid = franchise.getFranchiseCity() != null && !franchise.getFranchiseCity().trim().isEmpty();

        return franchiseNameValid && franchiseRepValid && franchiseNoValid && franchiseTelValid && franchiseAddressValid && franchisePostValid && franchiseStateValid && franchiseCityValid;
    }

    // 중복 체크
    public int duplicateFranchise(Franchise franchise) {
        return mapper.duplicateFranchise(franchise);
    }

    // 가맹점 등록하기
    public boolean addFranchise(Franchise franchise) {
        // 기존 가맹점 코드에서 최대 번호를 조회
        Long maxNo = mapper.viewMaxFranchiseCode(franchise.getFranchiseCode());

        // 최대 번호가 없으면 1, 있으면 1을 더한 값을 3자리 형식으로 생성
        String newNumber = String.format("%03d", (maxNo == null) ? 1 : maxNo + 1);

        // 기존 가맹점 코드와 새로운 번호를 합쳐서 새로운 가맹점 코드 생성
        String insertFranchiseCode = "FRN" + newNumber;

        // 새로운 가맹점 코드를 Franchise 객체에 설정
        franchise.setFranchiseCode(insertFranchiseCode);

        int cnt = mapper.addFranchise(franchise);
        return cnt == 1;
    }

    // 가맹점 리스트 조회
    public Map<String, Object> franchiseList(Boolean active, Integer page, String type, String keyword, String sort, String order) {

        // SQL의 LIMIT 키워드에서 사용되는 offset
        Integer offset = (page - 1) * 10;

        // 조회되는 게시물들
        List<Franchise> franchiseList = mapper.getFranchiseList(active, offset, type, keyword, sort, order);

        // 전체 게시물 수
        Integer count = mapper.countFranchiseList(active, type, keyword);
        return Map.of("franchiseList", franchiseList, "count", count);
    }

    // 특정 가맹점 조회 (캐시 적용)
    @Cacheable(value = "franchiseList", key = "#franchiseKey")
    public Franchise viewFranchise(int franchiseKey) {
        return mapper.viewFranchise(franchiseKey);
    }

    // 특정 가맹점 수정
    public boolean editFranchise(Franchise franchise) {
        int cnt = mapper.editFranchise(franchise);
        return cnt == 1;
    }

    // 특정 가맹점 삭제 (비활성화)
    public boolean deleteFranchise(int franchiseKey) {
        int cnt = mapper.deleteFranchise(franchiseKey);
        return cnt == 1;
    }
}