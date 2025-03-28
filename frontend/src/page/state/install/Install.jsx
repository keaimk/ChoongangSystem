import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import { StateSideBar } from "../../../components/tool/sidebar/StateSideBar.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { InstallList } from "../../../components/state/install/InstallList.jsx";
import { InstallRequest } from "../../../components/state/install/InstallRequest.jsx";
import { InstallApprove } from "../../../components/state/install/InstallApprove.jsx";
import axios from "axios";
import { InstallConfiguration } from "../../../components/state/install/InstallConfiguration.jsx";
import { useSearchParams } from "react-router-dom";
import { AuthenticationContext } from "../../../context/AuthenticationProvider.jsx";

export function Install() {
  const { company } = useContext(AuthenticationContext);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [configurationDialogOpen, setConfigurationDialogOpen] = useState(false);
  const [installList, setInstallList] = useState([]);
  const [selectedInstall, setSelectedInstall] = useState(null);
  const [change, setChange] = useState();
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams("");

  useEffect(() => {
    axios
      .get("/api/install/list", {
        params: searchParams,
      })
      .then((res) => {
        const formattedList = res.data.list.map((list) => {
          // requestKey 상태에 따라 "대기", "승인", "반려" 구분
          let state = null;

          if (!list.installApproveKey) {
            if (list.installRequestConsent === false) {
              state = "반려";
            } else if (list.installRequestConsent === true) {
              state = "승인";
            } else {
              state = "대기"; // undefined이거나 null일 경우
            }
          } else if (list.installApproveKey) {
            if (!list.installApproveConsent) {
              state = "승인";
            } else if (list.installApproveConsent === true) {
              state = "완료";
            } else if (list.installApproveConsent === false) {
              state = "반려";
            }
          }

          return { ...list, state };
        });
        setInstallList(formattedList || []);
        setCount(res.data.count);
      })
      .catch((error) => {
        console.error("품목 목록 요청 중 오류 발생: ", error);
      });
  }, [searchParams, change]);

  const handleRowClick = (key) => {
    setSelectedInstall(key);

    if (key.state === "대기" || key.state === "반려") {
      setApproveDialogOpen(true);
    } else if (key.state === "승인" || key.state === "완료") {
      setConfigurationDialogOpen(true);
    }
  };

  return (
    <Box>
      <HStack align="flex-start" w="100%">
        <StateSideBar />
        <Stack flex={1} p={5}>
          <Heading size={"xl"} p={2} mb={3}>
            구매 / 설치 관리 {">"} 설치 관리
          </Heading>
          <InstallList
            installList={installList}
            onRowClick={handleRowClick}
            count={count}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
          {company && !company.startsWith("CUS") && (
            <Flex justify="flex-end">
              <Button
                onClick={() => setRequestDialogOpen(true)}
                size="lg"
                mt={-16}
              >
                설치 요청
              </Button>
            </Flex>
          )}
        </Stack>
        <InstallRequest
          isOpen={requestDialogOpen}
          onClose={() => setRequestDialogOpen(false)}
          setChange={setChange}
        />
        <InstallApprove
          installKey={selectedInstall?.installRequestKey}
          isOpen={approveDialogOpen}
          onClose={() => setApproveDialogOpen(false)}
          setChange={setChange}
        />
        <InstallConfiguration
          installKey={selectedInstall?.installApproveKey}
          isOpen={configurationDialogOpen}
          onClose={() => setConfigurationDialogOpen(false)}
          setChange={setChange}
        />
      </HStack>
    </Box>
  );
}
