import React, { useCallback, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import { Flex, Drawer, Text } from "@ledgerhq/react-ui";
import { DeviceModelId } from "@ledgerhq/devices";
import { useStartPostOnboardingCallback } from "@ledgerhq/live-common/postOnboarding/hooks/index";

import { SettingsSectionRow } from "~/renderer/screens/settings/SettingsSection";
import Button from "~/renderer/components/Button";
import { openModal } from "~/renderer/actions/modals";
import { useHistory, useRouteMatch } from "react-router-dom";

const PostOnboardingHubTester = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { path } = useRouteMatch();

  const handleInitFTS = useStartPostOnboardingCallback(DeviceModelId.nanoFTS, true);

  return (
    <SettingsSectionRow
      title={t("settings.experimental.features.testPostonboarding.title")}
      desc={t("settings.experimental.features.testPostonboarding.description")}
    >
      <Button onClick={handleInitFTS} primary>
        {t("postOnboardingDebugger.buttonTitle")}
      </Button>
    </SettingsSectionRow>
  );
};

export default PostOnboardingHubTester;
