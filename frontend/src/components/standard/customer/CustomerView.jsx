import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { Button } from "../../ui/button.jsx";
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
import { Field } from "../../ui/field.jsx";
import { Checkbox } from "../../ui/checkbox.jsx";
import { SpacedLabel } from "../../tool/form/SpaceLabel.jsx";
import { Tooltip } from "../../ui/tooltip.jsx";

function CustomerView({ isOpen, onCancel, customerKey, onEdit }) {
  const initialCustomer = {
    customerName: "",
    customerCode: "",
    itemName: "",
    industry: "",
    customerRep: "",
    customerNo: "",
    corporateNo: "",
    customerTel: "",
    customerFax: "",
    customerPost: "",
    customerAddress: "",
    customerAddressDetails: "",
    customerNote: "",
    customerActive: true,
  };
  const [customer, setCustomer] = useState(initialCustomer);

  //정보 불러오기
  useEffect(() => {
    if (isOpen && customerKey) {
      axios
        .get(`/api/customer/view/${customerKey}`)
        .then((res) => {
          setCustomer(res.data);
          // console.log("back 반환", res.data);
        })
        .catch((error) => console.error("오류 발생", error));
    }
  }, [isOpen, customerKey]);
  // console.log("key", customerKey);

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // 스킹 처리
    if (name === "customerTel" || name === "customerFax") {
      value = formatPhoneNumber(value);
    } else if (name === "corporateNo") {
      value = formatCorporateNo(value);
    } else if (name === "customerNo") {
      value = formatBusinessNo(value);
    }

    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
    // console.log("입력 정보", customer);
  };

  const handleClose = () => {
    // setIsEditing(false);
    onCancel();
  };

  //비활성화
  const isValid =
    customer.customerName &&
    customer.customerRep &&
    customer.customerNo &&
    customer.corporateNo &&
    customer.customerTel &&
    customer.customerPost &&
    customer.customerAddress;

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/\D/g, ""); // 숫자 이외 제거

    if (onlyNums.startsWith("02")) {
      // 서울 지역번호(02)인 경우
      if (onlyNums.length <= 2) return onlyNums;
      if (onlyNums.length <= 5)
        return onlyNums.replace(/(\d{2})(\d+)/, "$1-$2");
      if (onlyNums.length <= 9)
        return onlyNums.replace(/(\d{2})(\d{3})(\d+)/, "$1-$2-$3");
      return onlyNums.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
      // 일반 지역번호 또는 휴대폰 번호
      if (onlyNums.length <= 3) return onlyNums;
      if (onlyNums.length <= 6)
        return onlyNums.replace(/(\d{3})(\d+)/, "$1-$2");
      if (onlyNums.length <= 10)
        return onlyNums.replace(/(\d{3})(\d{3,4})(\d+)/, "$1-$2-$3");
      return onlyNums.slice(0, 11).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  };

  const formatCorporateNo = (value) => {
    const onlyNums = value.replace(/\D/g, ""); // 숫자 이외 제거
    if (onlyNums.length <= 6) return onlyNums;
    return onlyNums.slice(0, 13).replace(/(\d{6})(\d{7})/, "$1-$2");
  };

  const formatBusinessNo = (value) => {
    const onlyNums = value.replace(/\D/g, ""); // 숫자 이외 제거
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 5) return onlyNums.replace(/(\d{3})(\d+)/, "$1-$2");
    return onlyNums.slice(0, 10).replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
  };
  return (
    <Box>
      <DialogRoot
        open={isOpen}
        onOpenChange={() => {
          onCancel();
          setCustomer(initialCustomer);
        }}
        size={"lg"}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>협력 업체 정보</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {customer ? (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
                css={{ "--field-label-width": "85px" }}
              >
                <Box display="flex" gap={5}>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="업체" />}
                  >
                    <Input
                      name="customerName"
                      value={customer.customerName || ""}
                      onChange={handleInputChange}
                    />
                  </Field>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="업체 코드" />}
                  >
                    <Input
                      readOnly
                      value={customer.customerCode}
                      variant={"subtle"}
                    />
                  </Field>
                </Box>
                <Box display="flex" gap={5}>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="취급 품목" />}
                  >
                    <Input
                      readOnly
                      name="itemName"
                      value={customer.itemName}
                      variant={"subtle"}
                    />
                  </Field>
                  <Field
                    orientation={"horizontal"}
                    label={<SpacedLabel text="업태" />}
                  >
                    <Input
                      variant={"subtle"}
                      readOnly
                      name={"industry"}
                      value={customer.industry}
                    ></Input>
                  </Field>
                </Box>
                <Field
                  orientation="horizontal"
                  label={<SpacedLabel text="대표자" />}
                >
                  <Input
                    name="customerRep"
                    value={customer.customerRep || ""}
                    onChange={handleInputChange}
                  />
                </Field>
                <Box display="flex" gap={5}>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="사업자 번호" />}
                  >
                    <Input
                      name="customerNo"
                      value={customer.customerNo || ""}
                      onChange={handleInputChange}
                      maxLength={12}
                    />
                  </Field>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="법인 번호" />}
                  >
                    <Input
                      name="corporateNo"
                      value={customer.corporateNo || ""}
                      onChange={handleInputChange}
                      maxLength={14}
                    />
                  </Field>
                </Box>
                <Box display="flex" gap={5}>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="전화번호" />}
                  >
                    <Input
                      name="customerTel"
                      value={customer.customerTel || ""}
                      onChange={handleInputChange}
                      maxLength={13}
                    />
                  </Field>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="팩스" />}
                  >
                    <Input
                      type={"tel"}
                      name="customerFax"
                      value={customer.customerFax || ""}
                      onChange={handleInputChange}
                      maxLength={13}
                    />
                  </Field>
                </Box>
                <Field
                  orientation="horizontal"
                  label={<SpacedLabel text="우편번호" />}
                >
                  <Input
                    name={"customerPost"}
                    value={customer.customerPost || ""}
                    onChange={handleInputChange}
                    maxLength={5}
                  />
                </Field>
                <Field
                  orientation="horizontal"
                  label={<SpacedLabel text="주소" />}
                >
                  <Input
                    name={"customerAddress"}
                    value={customer.customerAddress || ""}
                    onChange={handleInputChange}
                  />
                </Field>
                <Field
                  orientation="horizontal"
                  label={<SpacedLabel text="상세 주소" />}
                >
                  <Input
                    name={"customerAddressDetails"}
                    value={customer.customerAddressDetails || ""}
                    onChange={handleInputChange}
                  />
                </Field>
                <Field
                  orientation="horizontal"
                  label={<SpacedLabel text="비고" />}
                >
                  <Textarea
                    placeholder={"최대 50자"}
                    name={"customerNote"}
                    value={customer.customerNote || ""}
                    onChange={handleInputChange}
                    maxHeight={"100px"}
                    maxLength={50}
                  />
                </Field>
                <Field
                  orientation="horizontal"
                  label={<SpacedLabel text="사용 여부" />}
                >
                  <Checkbox
                    transform="translateX(-2560%)"
                    name={"customerActive"}
                    checked={customer.customerActive}
                    onCheckedChange={(e) => {
                      const checked =
                        e.checked !== undefined ? e.checked : e.target.checked;
                      setCustomer((prevCustomer) => ({
                        ...prevCustomer,
                        customerActive: checked, // 상태 업데이트
                      }));
                    }}
                  />
                </Field>
              </Box>
            ) : (
              <p>고객 정보를 불러오는 중입니다...</p>
            )}
          </DialogBody>
          <DialogFooter>
            <HStack>
              <DialogActionTrigger asChild>
                <Button variant="outline" onClick={handleClose}>
                  취소
                </Button>
              </DialogActionTrigger>
              <Tooltip
                content="입력을 완료해 주세요."
                openDelay={100}
                closeDelay={100}
                disabled={isValid}
              >
                <Button onClick={() => onEdit(customer)} disabled={!isValid}>
                  확인
                </Button>
              </Tooltip>
            </HStack>
            <DialogCloseTrigger />
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}

export default CustomerView;
