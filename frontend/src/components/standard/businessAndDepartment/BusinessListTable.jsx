import { Box, Table } from "@chakra-ui/react";
import React from "react";
import { SortableColumnHeader } from "../../tool/SortableColumnHeader.jsx";

export function BusinessListTable({
  department,
  sort,
  handleSort,
  openDialog,
}) {
  // 컬럼 배열 정의
  const columnsList = [
    { key: "department_code", label: "#" },
    { key: "department_name", label: "부서명" },
    { key: "department_tel", label: "전화번호" },
    { key: "department_fax", label: "팩스" },
  ];

  return (
    <Box>
      <Table.Root>
        <Table.Header>
          <Table.Row whiteSpace={"nowrap"} bg={"gray.100"}>
            {columnsList.map((col) => (
              <SortableColumnHeader
                key={col.key}
                columnKey={col.key}
                label={col.label}
                sort={sort}
                handleSort={handleSort}
              />
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {department.map((list, index) => (
            <Table.Row
              key={list.departmentKey || index}
              _hover={{ cursor: "pointer", backgroundColor: "gray.200" }}
              onDoubleClick={() => openDialog(list)}
              bg={list.departmentActive ? "white" : "gray.200"}
            >
              <Table.Cell textAlign="center">{index + 1}</Table.Cell>
              <Table.Cell textAlign="center">{list.departmentName}</Table.Cell>
              <Table.Cell textAlign="center">{list.departmentTel}</Table.Cell>
              <Table.Cell textAlign="center">{list.departmentFax}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
