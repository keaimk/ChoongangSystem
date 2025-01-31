import React, { useState } from "react";
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
import { Box, Input } from "@chakra-ui/react";
import axios from "axios";
import { toaster } from "../../ui/toaster.jsx";

export function WarehouseAdd({ isOpen, onConfirm, onClose, title }) {
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

  const resetState = () => {
    setWarehouseName("");
    setCustomerCode("");
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
      })
      .catch((e) => {
        const message = e.response?.data?.message;
        toaster.create({ description: message.text, type: message.type });
      });
    resetState();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box>
            창고
            <Input
              type={"text"}
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
            />
            담당 업체
            <Input
              type={"text"}
              value={customerCode}
              onChange={(e) => setCustomerCode(e.target.value)}
            />
            주소
            <Input
              type={"text"}
              value={warehouseAddress}
              onChange={(e) => setWarehouseAddress(e.target.value)}
            />
            상세 주소
            <Input
              type={"text"}
              value={warehouseAddressDetail}
              onChange={(e) => setWarehouseAddressDetail(e.target.value)}
            />
            우편 번호
            <Input
              type={"text"}
              value={warehousePost}
              onChange={(e) => setWarehousePost(e.target.value)}
            />
            광역 시도
            <Input
              type={"text"}
              value={warehouseState}
              onChange={(e) => setWarehouseState(e.target.value)}
            />
            시군
            <Input
              type={"text"}
              value={warehouseCity}
              onChange={(e) => setWarehouseCity(e.target.value)}
            />
            관리자명
            <Input
              type={"text"}
              value={customerEmployeeNo}
              onChange={(e) => setCustomerEmployeeNo(e.target.value)}
            />
            전화번호
            <Input
              type={"text"}
              value={warehouseTel}
              onChange={(e) => setWarehouseTel(e.target.value)}
            />
            {/*취급 물품<Input>{warehouseDetail.}</Input>*/}
            사용 여부
            <Input
              type={"text"}
              value={warehouseActive}
              onChange={(e) => setWarehouseActive(e.target.value)}
            />
            비고
            <Input
              type={"text"}
              value={warehouseNote}
              onChange={(e) => setWarehouseNote(e.target.value)}
            />
          </Box>
        </DialogBody>
        <DialogFooter>
          <DialogCloseTrigger onClick={onClose} />
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
          </DialogActionTrigger>
          <Button
            variant="solid"
            onClick={() => {
              handleSaveClick();
              onConfirm();
            }}
          >
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
