import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../ui/dialog.jsx";
import { Button } from "../../ui/button.jsx";
import {
  Box,
  Center,
  createListCollection,
  HStack,
  Input,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";

import { Field } from "../../ui/field.jsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthenticationContext } from "../../../context/AuthenticationProvider.jsx";
import axios from "axios";
import { SpacedLabel } from "../../tool/form/SpaceLabel.jsx";

export function InstkDetaiViewModal({
  isModalOpen,
  setChangeModal,
  instk,
  isLoading,
  selectInputKey,
}) {
  const { id } = useContext(AuthenticationContext);
  const [detailData, setDetailData] = useState({ serialList: [] });
  const [serialLocationList, setSerialLocationList] = useState([]);
  const [item, setItem] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectLocationKey, setSelectLocationKey] = useState();

  const contentRef = useRef(null);

  useEffect(() => {
    if (!instk?.inputKey) return; // instk가 없으면 실행 안 함

    setIsDataLoading(true); // 데이터 로딩 시작

    console.log(selectInputKey, "detailView selectInputKey");
    axios
      .get(`/api/instk/detailview/${selectInputKey}`, {
        params: {
          inputCommonCodeName: instk.inputCommonCodeName,
        },
      })
      .then((res) => {
        setDetailData(res.data);
        const list = res.data?.serialLocationList || [];
        if (list.length > 0) {
          const formattedList = createListCollection({
            items: list.map((item) => ({
              label: `${item.serialNo}`,
              value: item.locationKey,
            })),
          });
          console.log(formattedList, "formait:리스트컬렉션");
          setSerialLocationList(formattedList);
        } else {
          setSerialLocationList([]); // 빈 배열로 설정하여 오류 방지
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setSerialLocationList(null); // 에러 발생 시 리스트 초기화
      })
      .finally(() => {
        setIsDataLoading(false); // 데이터 로딩 완료
      });
  }, [instk]); // instk가 변경될 때마다 실행

  if (isLoading || isDataLoading) {
    return <Input readOnly value="로딩 중..." />;
  }

  const handleSerialChange = (e) => {
    setItem(e.value);
    setSelectLocationKey(e.value);
  };

  return (
    <DialogRoot size={"lg"} open={isModalOpen} onOpenChange={setChangeModal}>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>
            {detailData.inputConsent == true
              ? "입고 승인 상세"
              : "입고 반려 상세"}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <DialogBody
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            css={{ "--field-label-width": "85px" }}
          >
            <Center p={4}>
              <Spinner /> {/* 또는 다른 로딩 인디케이터 */}
            </Center>
          </DialogBody>
        ) : (
          <DialogBody>
            <Box css={{ "--field-label-width": "85px" }}>
              <Stack gap={15}>
                <Box display={"flex"} gap={5}>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="입고 구분" />}
                  >
                    <Input readOnly value={instk.inputCommonCodeName} />
                  </Field>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="주문 번호" />}
                  >
                    <Input readOnly value={instk.inputNo} />
                  </Field>
                </Box>
                <HStack gap={5}>
                  <Field
                    orientation="horizontal"
                    label={<SpacedLabel text="품목" />}
                  >
                    <Input readOnly value={instk.itemCommonName} />
                  </Field>

                  {detailData.inputConsent && (
                    <Field
                      orientation="horizontal"
                      label={<SpacedLabel text="시리얼 번호" />}
                    >
                      <SelectRoot
                        collection={serialLocationList}
                        value={item || ""}
                        position="relative"
                        onValueChange={handleSerialChange}
                      >
                        {/*<SelectLabel orientation="horizontal">*/}
                        {/*  시리얼 번호*/}
                        {/*</SelectLabel>*/}
                        <SelectTrigger>
                          <SelectValueText
                            placeholder={`내역 ${serialLocationList.items.length}건 확인`}
                          />
                        </SelectTrigger>
                        <SelectContent
                          portalRef={contentRef}
                          style={{
                            width: "100%",
                            top: "40px",
                            position: "absolute",
                          }}
                        >
                          {serialLocationList.items.map((code, index) => (
                            <SelectItem item={code} key={index}>
                              {code.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectRoot>
                    </Field>
                  )}
                </HStack>
                <HStack gap={5}>
                  <Field
                    label={<SpacedLabel text="담당 업체" />}
                    orientation="horizontal"
                  >
                    <Input readOnly value={instk.customerName} />
                  </Field>

                  <Field
                    label={<SpacedLabel text="창고" />}
                    orientation="horizontal"
                  >
                    <Input
                      readOnly
                      value={`${detailData.wareHouseName}${detailData.inputConsent ? ` (Location: ${selectLocationKey || ""})` : ""}`}
                    />
                  </Field>
                </HStack>

                <Field
                  label={<SpacedLabel text="창고 주소" />}
                  orientation="horizontal"
                >
                  <Input readOnly value={detailData.wareHouseAddress} />
                </Field>

                <HStack gap={5}>
                  <Field
                    label={<SpacedLabel text="주문 요청자" />}
                    orientation="horizontal"
                  >
                    <Input readOnly value={instk.requestEmployeeName} />
                  </Field>
                  <Field
                    label={<SpacedLabel text="사번" />}
                    orientation="horizontal"
                  >
                    <Input readOnly value={instk.requestEmployeeNo} />
                  </Field>
                </HStack>
                <Field
                  orientation="horizontal"
                  label={<SpacedLabel text="요청일" />}
                >
                  <Input readOnly value={instk.requestDate} />
                </Field>

                <Field
                  label={<SpacedLabel text="주문 비고" />}
                  orientation="horizontal"
                >
                  {instk.inputNote ? (
                    <Textarea
                      readOnly
                      value={instk.inputNote}
                      style={{ maxHeight: "100px", overflowY: "auto" }}
                    />
                  ) : (
                    <Input readOnly value={"내용 없음"} />
                  )}
                </Field>
                {detailData.inputConsent === true ? (
                  <HStack gap={5}>
                    <Field
                      label={<SpacedLabel text="승인자" />}
                      orientation="horizontal"
                    >
                      <Input readOnly value={instk.inputStockEmployeeName} />
                    </Field>
                    <Field
                      label={<SpacedLabel text="사번" />}
                      orientation="horizontal"
                    >
                      <Input readOnly value={instk.inputStockEmployeeNo} />
                    </Field>
                  </HStack>
                ) : (
                  <HStack gap={5}>
                    <Field
                      label={<SpacedLabel text="반려자" />}
                      orientation="horizontal"
                    >
                      <Input
                        readOnly
                        value={detailData.disapproveEmployeeName}
                      />
                    </Field>
                    <Field
                      label={<SpacedLabel text="사번" />}
                      orientation="horizontal"
                    >
                      <Input readOnly value={detailData.disapproveEmployeeNo} />
                    </Field>
                  </HStack>
                )}

                {detailData.inputConsent === true ? (
                  <Field
                    label={<SpacedLabel text="승인일" />}
                    orientation="horizontal"
                  >
                    <Input readOnly value={instk.inputStockDate} />
                  </Field>
                ) : (
                  <Field
                    label={<SpacedLabel text="반려일" />}
                    orientation="horizontal"
                  >
                    <Input readOnly value={detailData.disapproveDate} />
                  </Field>
                )}

                {/*true고  비고 없으면 필드 , */}
                {detailData.inputConsent === true ? (
                  // true
                  <Field
                    label={<SpacedLabel text="승인 비고" />}
                    orientation="horizontal"
                  >
                    {detailData.inputStockNote ? (
                      <Textarea
                        readOnly
                        value={detailData.inputStockNote}
                        style={{ maxHeight: "100px", overflowY: "auto" }}
                      />
                    ) : (
                      <Input readOnly value={"내용 없음"} />
                    )}
                  </Field>
                ) : (
                  // false
                  <Field
                    label={<SpacedLabel text="반려 비고" />}
                    orientation="horizontal"
                  >
                    {detailData.disapproveNote ? (
                      <Textarea
                        readOnly
                        value={detailData.disapproveNote}
                        style={{ maxHeight: "100px", overflowY: "auto" }}
                      />
                    ) : (
                      <Input readOnly value={"내용 없음"} />
                    )}
                  </Field>
                )}
              </Stack>
            </Box>
          </DialogBody>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setChangeModal();
            }}
          >
            닫기
          </Button>
        </DialogFooter>
        <DialogCloseTrigger
          onClick={() => {
            setChangeModal();
          }}
        />
      </DialogContent>
    </DialogRoot>
  );
}
