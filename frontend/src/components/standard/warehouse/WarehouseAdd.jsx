import React, { useEffect, useState } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../ui/dialog.jsx";
import { Button } from "../../ui/button.jsx";
import { Box, Input, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { toaster } from "../../ui/toaster.jsx";
import { Field } from "../../ui/field.jsx";
import Select from "react-select";
import { Tooltip } from "../../ui/tooltip.jsx";
import { SpacedLabel } from "../../tool/form/SpaceLabel.jsx";
import { PhoneInput } from "../../tool/masking/PhoneInput.jsx";

export function WarehouseAdd({ isOpen, onClose, title }) {
  const [warehouseName, setWarehouseName] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState("");
  const [warehouseAddressDetail, setWarehouseAddressDetail] = useState("");
  const [warehousePost, setWarehousePost] = useState("");
  const [warehouseState, setWarehouseState] = useState("");
  const [warehouseCity, setWarehouseCity] = useState("");
  const [customerEmployeeNo, setCustomerEmployeeNo] = useState("");
  const [warehouseTel, setWarehouseTel] = useState("");
  const [warehouseActive, setWarehouseActive] = useState(true);
  const [warehouseNote, setWarehouseNote] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const initialWarehouseAdd = {
    warehouseName: "",
    customerEmployeeNo: "",
    customerName: "",
    customerCode: "",
    employeeName: "",
    warehouseTel: "",
    warehousePost: "",
    warehouseAddress: "",
    warehouseAddressDetail: "",
    warehouseNote: "",
  };
  const [warehouseAdd, setWarehouseAdd] = useState(initialWarehouseAdd);

  const resetState = () => {
    setWarehouseName("");
    setCustomerCode("");
    setCustomerName("");
    setWarehouseAddress("");
    setWarehouseAddressDetail("");
    setWarehousePost("");
    setWarehouseState("");
    setWarehouseCity("");
    setCustomerEmployeeNo("");
    setWarehouseTel("");
    setWarehouseNote("");
    setWarehouseActive(true);
  };

  // 요청 창 닫히면 초기화
  const handleClose = () => {
    setWarehouseAdd(initialWarehouseAdd);
    resetState();
    onClose();
  };

  // 협력 업체 정보 가져오기
  useEffect(() => {
    axios.get(`/api/warehouse/customer`).then((res) => {
      const customerOptions = res.data.map((customer) => ({
        value: customer.customerCode,
        label: customer.customerName,
      }));
      setCustomerList(customerOptions);
    });
  }, []);

  // 관리자 정보 가져오기
  useEffect(() => {
    if (customerCode) {
      axios.get(`/api/warehouse/employee/${customerCode}`).then((res) => {
        const employeeOptions = res.data.map((employee) => ({
          value: employee.customerEmployeeNo,
          label: employee.employeeName,
        }));
        setEmployeeList(employeeOptions);
      });
    }
  }, [customerCode]);

  // 담당업체 변경 시 관리자 컬렉션 생성
  const handleCustomerChange = (selectedOption) => {
    setCustomerName(selectedOption.label);
    setCustomerCode(selectedOption.value);
    setSelectedCustomer(selectedOption);

    // 선택 즉시 warehouseAdd 업데이트
    setWarehouseAdd((prev) => ({
      ...prev,
      customerName: selectedOption.label,
      customerCode: selectedOption.value,
    }));
  };

  // 관리자 변경
  const handleEmployeeChange = (selectedOption) => {
    setEmployeeName(selectedOption.label);
    setCustomerEmployeeNo(selectedOption.value);
    setSelectedEmployee(selectedOption);

    // 선택 즉시 warehouseAdd 업데이트
    setWarehouseAdd((prev) => ({
      ...prev,
      employeeName: selectedOption.label,
      customerEmployeeNo: selectedOption.value,
    }));
  };

  // 협력 업체 클릭 시
  const onCustomerClick = () => {
    if (selectedCustomer) {
      setWarehouseAdd((prev) => ({
        ...prev,
        customerName: selectedCustomer.label,
        customerCode: selectedCustomer.value,
      }));
    }
  };

  const handleSaveClick = () => {
    axios
      .post(`/api/warehouse/add`, {
        warehouseName,
        customerCode,
        warehouseAddress,
        warehouseAddressDetail,
        warehousePost,
        warehouseState,
        warehouseCity,
        customerEmployeeNo,
        warehouseTel,
        warehouseActive,
        warehouseNote,
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          description: data.message.text,
          type: data.message.type,
        });
        handleClose();
      })
      .catch((e) => {
        const message = e.response?.data?.message;
        toaster.create({ description: message.text, type: message.type });
      });
    resetState();
  };

  useEffect(() => {
    if (!isOpen) {
      handleClose(); // 다이얼로그가 닫히면 항상 초기화
    }
  }, [isOpen]);

  //유효성 검사
  const validate = () => {
    return (
      warehouseName != "" &&
      customerCode != "" &&
      customerEmployeeNo != "" &&
      warehousePost != "" &&
      warehouseState != "" &&
      warehouseCity != "" &&
      warehouseAddress != ""
    );
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} size="lg">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
            css={{ "--field-label-width": "85px" }}
          >
            <Box>
              <Field
                label={<SpacedLabel text="창고" req />}
                orientation="horizontal"
                mb={15}
                required
              >
                <Input
                  type={"text"}
                  value={warehouseName}
                  onChange={(e) => setWarehouseName(e.target.value)}
                />
              </Field>
              <Field
                label={<SpacedLabel text="담당 업체" req />}
                orientation="horizontal"
                mb={15}
                required
              >
                <Select
                  options={customerList}
                  value={customerList.find(
                    (opt) => opt.value === warehouseAdd.customerName,
                  )}
                  onChange={handleCustomerChange}
                  placeholder="담당 업체 선택"
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: "538.5px", // 너비 고정
                      height: "40px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 100, // 선택 목록이 다른 요소를 덮도록
                      width: "538.5px",
                    }),
                  }}
                />
                {/*<Button onClick={onCustomerClick}>조회</Button>*/}
              </Field>
              <Field
                label={<SpacedLabel text="관리자" req />}
                orientation="horizontal"
                mb={15}
                required
              >
                <Select
                  options={employeeList}
                  value={employeeList.find(
                    (opt) => opt.value === warehouseAdd.employeeName,
                  )}
                  onChange={handleEmployeeChange}
                  placeholder="관리자 선택"
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: "538.5px", // 너비 고정
                      height: "40px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 100, // 선택 목록이 다른 요소를 덮도록
                      width: "538.5px",
                    }),
                  }}
                />
              </Field>
              <Field
                label={<SpacedLabel text="전화번호" req />}
                orientation="horizontal"
                mb={15}
                required
              >
                <PhoneInput value={warehouseTel} onChange={setWarehouseTel} />
              </Field>
              <Field
                label={<SpacedLabel text="우편번호" req />}
                orientation="horizontal"
                mb={15}
                required
              >
                <Input
                  type={"text"}
                  value={warehousePost}
                  onChange={(e) => setWarehousePost(e.target.value)}
                />
              </Field>
              <Box display="flex" gap={5}>
                <Field
                  label={<SpacedLabel text="광역시도" req />}
                  orientation="horizontal"
                  mb={15}
                  required
                >
                  <Input
                    type={"text"}
                    value={warehouseState}
                    onChange={(e) => setWarehouseState(e.target.value)}
                  />
                </Field>
                <Field
                  label={<SpacedLabel text="시군" req />}
                  orientation="horizontal"
                  mb={15}
                  required
                >
                  <Input
                    type={"text"}
                    value={warehouseCity}
                    onChange={(e) => setWarehouseCity(e.target.value)}
                  />
                </Field>
              </Box>
              <Field
                label={<SpacedLabel text="주소" req />}
                orientation="horizontal"
                mb={15}
                required
              >
                <Input
                  type={"text"}
                  value={warehouseAddress}
                  onChange={(e) => setWarehouseAddress(e.target.value)}
                />
              </Field>
              <Field
                label={<SpacedLabel text="상세 주소" />}
                orientation="horizontal"
                mb={15}
              >
                <Input
                  type={"text"}
                  value={warehouseAddressDetail}
                  onChange={(e) => setWarehouseAddressDetail(e.target.value)}
                />
              </Field>
              <Field
                label={<SpacedLabel text="비고" />}
                orientation="horizontal"
                mb={15}
              >
                <Textarea
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                  placeholder="최대 50자"
                  type={"text"}
                  value={warehouseNote}
                  onChange={(e) => setWarehouseNote(e.target.value)}
                />
              </Field>
            </Box>
          </Box>
        </DialogBody>
        <DialogFooter>
          <DialogCloseTrigger onClick={handleClose} />
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={handleClose}>
              취소
            </Button>
          </DialogActionTrigger>
          <Tooltip
            content="입력을 완료해 주세요."
            openDelay={100}
            closeDelay={100}
            disabled={validate()}
          >
            <Button
              variant="solid"
              onClick={() => {
                handleSaveClick();
              }}
              disabled={!validate()}
            >
              등록
            </Button>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
