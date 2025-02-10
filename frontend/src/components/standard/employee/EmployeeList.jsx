import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  createListCollection,
  Flex,
  HStack,
  IconButton,
  Input,
  Table,
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../ui/select.jsx";
import { Checkbox } from "../../ui/checkbox.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EmployeeAddDialog } from "./EmployeeAddDialog.jsx";
import { EmployeeViewDialog } from "./EmployeeViewDialog.jsx";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { Sort } from "../../tool/form/Sort.jsx";
import { Pagination } from "../../tool/form/Pagination.jsx";

export function EmployeeList({ onSelect, updateList, viewKey, onChange }) {
  //검색 옵션
  const frameworks = createListCollection({
    items: [
      { label: "소속구분", value: "소속구분" },
      { label: "기업", value: "기업명" },
      { label: "직원", value: "직원명" },
      { label: "사번", value: "사번" },
    ],
  });
  // 소트
  const sortOptions = [
    { key: "기본키", label: "#" },
    { key: "소속구분", label: "소속 구분" },
    { key: "기업명", label: "회사" },
    { key: "기업번호", label: "회사 전화번호" },
    { key: "사번", label: "사번" },
    { key: "직원명", label: "직원" },
    { key: "직원전화번호", label: "직원 전화번호" },
  ];

  const navigate = useNavigate();
  const [memberList, setMemberList] = useState([]);
  const [count, setCount] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  // 상태 초기화: 쿼리 파라미터에서 값 가져오기
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [sort, setSort] = useState(searchParams.get("sort"));
  const [isActiveVisible, setIsActiveVisible] = useState(
    searchParams.get("active") === "true",
  );
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [type, setType] = useState([searchParams.get("type")] || "all");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isviewModalOpen, setIsviewModalOpen] = useState(false);

  const updateQuery = () => {
    setSearchParams({
      page: page,
      sort: sort,
      order: order,
      active: isActiveVisible,
      keyword: keyword,
      type: type,
    });
  };

  useEffect(() => {
    // 전체 직원 리스트 불러오기
    axios
      .get("api/employee/list", {
        params: {
          isActiveVisible: searchParams.get("active"),
          page: searchParams.get("page"),
          keyword: searchParams.get("keyword"),
          sort: searchParams.get("sort"),
          order: searchParams.get("order"),
          type: searchParams.get("type"),
        },
      })
      .then((res) => {
        setMemberList(res.data.employeeList);
        setCount(res.data.totalCount);
        // 정렬된 첫 번째 값을 불러오기 위해서
      })
      .catch((err) => {
        console.log("직원 정보를 받는중 오류", err);
      });
    // updateQuery();
  }, [updateList, searchParams]);

  // 리스트 클릭시 , 해당 키 값의 상세 정보를 보여주기 위해서
  const handleSelectedItem = (no) => {
    onSelect(no);
  };

  // active 보여주는거 정하는 버튼

  const handleVisible = () => {
    const active = searchParams.get("active");

    // active 값이 없으면 true, 있으면 반대로 변경
    const insertActive = active === null ? true : active !== "true";

    const newParams = new URLSearchParams(searchParams); // 기존 파라미터 복사
    newParams.set("active", insertActive); // "active" 키에 새로운 값 설정

    setSearchParams(newParams);
  };

  //  페이지 버튼 클릭시
  function handlePageChange(e) {
    setPage(e.page);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev); // 복사본 생성
      newParams.set("page", page); // "active" 키에 새로운 값 설정
      return newParams;
    });
  }

  function handleSearchButton() {
    const newParams = new URLSearchParams(searchParams); // 기존 파라미터 복사 (깊은 복사)
    newParams.set("type", type); // type 값 업데이트
    newParams.set("keyword", keyword); // keyword 값 업데이트
    newParams.set("page", 1);
    setSearchParams(newParams);
  }

  const handleSortControl = (sortName) => {
    const convertedOrderName =
      searchParams.get("order") === "ASC" ? "DESC" : "ASC";

    setSearchParams((prev) => {
      setSort(sortName);
      setOrder(convertedOrderName);
      const newParams = { ...prev }; // 기존 파라미터 복사 (깊은 복사)
      newParams.sort = sortName;
      newParams.order = convertedOrderName;
      return newParams; // 새로운 객체를 반환
    });
  };

  // 등록 모달창
  const handleModalControl = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 상세 모달창
  const handleviewModalControl = () => {
    setIsviewModalOpen(!isviewModalOpen);
  };

  //파람지우기
  const handleResetClick = () => {
    setSearchParams({}); // 검색 파라미터 초기화
    setPage(1); // 페이지 1로 초기화
    setSort("all"); // 기본 정렬 설정
    setIsActiveVisible(false); // 기본 활성 상태 설정
    setKeyword(""); // 검색어 초기화
    setType([]); // 기본 타입 설정
    setOrder("desc"); // 기본 정렬 순서 설정
  };

  return (
    <Box>
      <HStack justifyContent="center" w={"100%"} mt={-2}>
        <Box>
          <SelectRoot
            collection={frameworks}
            value={type}
            width="160px"
            position="relative"
            onValueChange={(e) => setType(e.value)}
          >
            <SelectTrigger>
              <SelectValueText placeholder={"전체"} />
            </SelectTrigger>
            <SelectContent>
              {frameworks.items.map((code) => (
                <SelectItem item={code} key={code.value}>
                  {code.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>

        <Input
          w={"50%"}
          placeholder={"검색어를 입력해 주세요."}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchButton();
            }
          }}
        />

        <IconButton
          transform="translateX(-130%) "
          style={{ cursor: "pointer" }}
          variant={"ghost"}
          onClick={handleResetClick}
        >
          <BsArrowCounterclockwise size="25px" />
        </IconButton>
        <Button onClick={handleSearchButton} transform="translateX(-75%)">
          검색
        </Button>
      </HStack>
      <Checkbox
        mt={3}
        mb={5}
        ml={3}
        checked={searchParams.get("active") === "true" ? true : false}
        onCheckedChange={(e) => handleVisible()}
      >
        미사용 포함 조회
      </Checkbox>
      <Table.Root interactive>
        <Table.Header>
          <Table.Row whiteSpace={"nowrap"} bg={"gray.100"}>
            <Sort
              sortOptions={sortOptions}
              onSortChange={(nextSearchParam) =>
                setSearchParams(nextSearchParam)
              }
              defaultSortKey={"기본키"}
            />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {memberList.map((item, index) => (
            <Table.Row
              style={{ cursor: "pointer" }}
              key={item.employeeKey}
              onDoubleClick={() => {
                handleSelectedItem(item.employeeKey);
                handleviewModalControl();
              }}
              bg={item.employeeActive ? "white" : "gray.100"}
              _hover={{ backgroundColor: "gray.200" }}
            >
              <Table.Cell width="90px" textAlign="center">
                {index + 1}
              </Table.Cell>
              <Table.Cell textAlign="center" width="15%">
                {item.employeeWorkPlaceCode}
              </Table.Cell>
              <Table.Cell textAlign="center" width="20%">
                {item.employeeCommonCode === "CUS"
                  ? item.employeeWorkPlaceName
                  : "(주) 중앙 컴퍼니"}
              </Table.Cell>
              <Table.Cell textAlign="center" width="15%">
                {item.employeeWorkPlaceTel}
              </Table.Cell>
              <Table.Cell textAlign="center" width="15%">
                {item.employeeNo}
              </Table.Cell>
              <Table.Cell textAlign="center" width="15%">
                {item.employeeName}
              </Table.Cell>
              <Table.Cell textAlign="center">{item.employeeTel}</Table.Cell>
            </Table.Row>
          ))}
          {memberList.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={7} textAlign="center">
                정보가 존재하지 않습니다.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
        <Table.Footer></Table.Footer>
      </Table.Root>

      <Flex justify="flex-end">
        <Box />
        <Box width="85%" textAlign="right">
          <Pagination
            count={count}
            pageSize={10}
            onPageChange={(newPage) => {
              const nextSearchParam = new URLSearchParams(searchParams);
              nextSearchParam.set("page", newPage);
              setSearchParams(nextSearchParam);
            }}
          />
        </Box>

        {/*페이지네이션과 동일값 */}
        <Box m={4}>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              //버튼 누를때초기화 -1로변경
              onSelect(-1);
            }}
            size={"lg"}
          >
            회원 등록
          </Button>
        </Box>
      </Flex>
      <EmployeeAddDialog
        isModalOpen={isModalOpen}
        modalChange={handleModalControl}
        viewKey={viewKey}
        onChange={onChange}
        onSelect={onSelect}
      />
      <EmployeeViewDialog
        isModalOpen={isviewModalOpen}
        modalChange={handleviewModalControl}
        viewKey={viewKey}
        onChange={onChange}
        onSelect={onSelect}
      />
    </Box>
  );
}
