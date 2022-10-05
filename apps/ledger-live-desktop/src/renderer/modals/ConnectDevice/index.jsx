// @flow

import React from "react";
import { getEnv } from "@ledgerhq/live-common/env";
import { createAction } from "@ledgerhq/live-common/hw/actions/app";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";

const connectAppExec = command("connectApp");
const connectManagerExec = command("connectManager");

const appAction = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);
const managerAction = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

const ConnectDevice = () => {
  return (
    <Modal
      name="MODAL_CONNECT_DEVICE"
      centered
      preventBackdropClick
      render={({ data, onClose }) => (
        <ModalBody
          onClose={() => {
            if (data.onCancel) {
              data.onCancel("Interrupted by user");
            }
            onClose();
          }}
          render={() => (
            <Box alignItems={"center"} px={32}>
              <DeviceAction
                action={data.appName ? appAction : managerAction}
                request={data.appName ? { appName: data.appName } : {}}
                onResult={res => {
                  console.log(res);
                  data.onResult(res);
                  onClose();
                }}
              />
            </Box>
          )}
        />
      )}
    />
  );
};

export default ConnectDevice;
