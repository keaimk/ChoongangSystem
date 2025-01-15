import React from "react";
import { createListCollection, Table } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox.jsx";
import { Button } from "../ui/button.jsx";

function CustomerList({
  customerList,
  customerKey,
  setCustomerKey,
  currentPage,
  count,
  handlePageChange,
  checkedActive,
  setCheckedActive,
  search,
  setSearch,
  handleSearchClick,
}) {
  const totalPages = Math.ceil(count / 10);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // console.log("list", customerList);
  // console.log(customerKey);

  const optionList = createListCollection({
    items: [
      { label: "전체", value: "all" },
      { label: "업체명", value: "customerName" },
      { label: "취급 물품", value: "itemName" },
      { label: "업체 대표", value: "customerRep" },
    ],
  });

  return (
    <div>
      {/* 검색창 */}
      <div>
        <input
          type="text"
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          placeholder="검색어 입력"
        />
        <Button onClick={handleSearchClick}>검색</Button>
      </div>

      {/* 체크박스 필터 */}
      <Checkbox
        isChecked={checkedActive}
        onChange={() => setCheckedActive(!checkedActive)}
      >
        삭제 내역 포함해서 보기
      </Checkbox>

      {/*테이블*/}
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>#</Table.ColumnHeader>
            <Table.ColumnHeader>업체명</Table.ColumnHeader>
            <Table.ColumnHeader>취급 물품</Table.ColumnHeader>
            <Table.ColumnHeader>대표자</Table.ColumnHeader>
            {/*<Table.ColumnHeader>계약여부</Table.ColumnHeader>*/}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customerList.map((customer, index) => (
            <Table.Row
              key={index}
              onClick={() => setCustomerKey(customer.customerKey)}
            >
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{customer.customerName}</Table.Cell>
              <Table.Cell>{customer.itemName}</Table.Cell>
              <Table.Cell>{customer.customerRep}</Table.Cell>
              {/*<Table.Cell>*/}
              {/*  {customer.customerActive ? "계약" : "계약 종료"}*/}
              {/*</Table.Cell>*/}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      {/*pagination*/}
      {/*<Center>*/}
      {/*  <PaginationRoot count={10} pageSize={2} defaultPage={1} variant="solid">*/}
      {/*    <HStack>*/}
      {/*      <PaginationPrevTrigger />*/}
      {/*      <PaginationItem />*/}
      {/*      <PaginationNextTrigger />*/}
      {/*    </HStack>*/}
      {/*  </PaginationRoot>*/}
      {/*</Center>*/}
    </div>
  );
}

export default CustomerList;
