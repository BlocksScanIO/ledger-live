import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components/native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { getDeviceModel } from "@ledgerhq/devices/index";
import { Flex, ScrollListContainer, Text } from "@ledgerhq/native-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowLeftMedium, HelpMedium } from "@ledgerhq/native-ui/assets/icons";
import useFeature from "@ledgerhq/live-common/featureFlags/useFeature";
import { DeviceModelId } from "@ledgerhq/types-devices";
import { TrackScreen } from "../../../analytics";
import { ScreenName, NavigatorName } from "../../../const";
import { OnboardingNavigatorParamList } from "../../../components/RootNavigator/types/OnboardingNavigator";
import {
  BaseNavigationComposite,
  RootNavigationComposite,
  StackNavigatorNavigation,
} from "../../../components/RootNavigator/types/helpers";

import nanoSSvg from "../assets/nanoS";
import nanoSPSvg from "../assets/nanoSP";
import nanoXSvg from "../assets/nanoX";
import DiscoverCard from "../../Discover/DiscoverCard";
import Illustration from "../../../images/illustration/Illustration";
import setupLedgerImg from "../../../images/illustration/Shared/_SetupLedger.png";
import { RootStackParamList } from "../../../components/RootNavigator/types/RootNavigator";
import { NavigateInput } from "../../../components/RootNavigator/types/BaseNavigator";

const nanoX = {
  SvgDevice: nanoXSvg,
  id: DeviceModelId.nanoX,
  setupTime: 600000,
};
const nanoS = {
  SvgDevice: nanoSSvg,
  id: DeviceModelId.nanoS,
  setupTime: 600000,
};
const nanoSP = {
  SvgDevice: nanoSPSvg,
  id: DeviceModelId.nanoSP,
  setupTime: 600000,
};
const nanoFTS = {
  SvgDevice: nanoXSvg,
  id: DeviceModelId.nanoFTS,
  setupTime: 300000,
};

type NavigationProp = RootNavigationComposite<
  BaseNavigationComposite<
    StackNavigatorNavigation<
      OnboardingNavigatorParamList,
      ScreenName.OnboardingDeviceSelection
    >
  >
>;

function OnboardingStepDeviceSelection() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const syncOnboarding = useFeature("syncOnboarding" as const);

  const devices = useMemo(() => {
    if (syncOnboarding?.enabled) {
      return [nanoFTS, nanoX, nanoSP, nanoS];
    }
    return [nanoX, nanoSP, nanoS];
  }, [syncOnboarding?.enabled]);

  const getProductName = (modelId: DeviceModelId) =>
    getDeviceModel(modelId)?.productName || modelId;

  const handleBack = () => {
    navigation.dispatch(StackActions.popToTop());
  };

  const handleHelp = () => {
    // TODO
  };

  const next = (deviceModelId: DeviceModelId) => {
    // Add NanoX.id, NanoSP.id etc, to the array when supported
    if ([nanoFTS.id].includes(deviceModelId)) {
      const navigateInput: NavigateInput<
        RootStackParamList,
        NavigatorName.BaseOnboarding
      > = {
        name: NavigatorName.BaseOnboarding,
        params: {
          screen: NavigatorName.SyncOnboarding,
          params: {
            screen: ScreenName.SyncOnboardingCompanion,
            params: {
              // FIXME: A null device will crash SyncOnboarding…
              // @ts-expect-error This seems to be very wrong :(
              device: null,
            },
          },
        },
      };
      // On pairing success, navigate to the Sync Onboarding Companion
      // navigation.push on stack navigation because with navigation.navigate
      // it could not go back to this screen in certain cases.
      navigation.push(NavigatorName.Base, {
        screen: ScreenName.BleDevicePairingFlow,
        params: {
          // TODO: for now we remove this
          // filterByDeviceModelId: DeviceModelId.nanoFTS,
          areKnownDevicesDisplayed: true,
          onSuccessAddToKnownDevices: false,
          onSuccessNavigateToConfig: {
            // navigation.push on success because it could not correctly
            // go back to the previous screens (BLE and then this screen).
            navigationType: "push",
            navigateInput,
            pathToDeviceParam: "params.params.params.device",
          },
        },
      });
    } else {
      // TODO: FIX @react-navigation/native using Typescript
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore next-line
      navigation.navigate(ScreenName.OnboardingUseCase, {
        deviceModelId,
      });
    }
  };

  return (
    <SafeAreaView
      style={[{ flex: 1 }, { backgroundColor: colors.background.main }]}
    >
      <Flex
        px={6}
        pt={8}
        mb={7}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Flex>
          <TouchableOpacity onPress={handleBack}>
            <ArrowLeftMedium size={24} />
          </TouchableOpacity>
        </Flex>
        <Flex>
          <TouchableOpacity onPress={handleHelp}>
            <HelpMedium size={24} />
          </TouchableOpacity>
        </Flex>
      </Flex>
      <ScrollListContainer flex={1} px={6} bg="background.main">
        <Flex flex={1}>
          <Text variant="h4" mb={3} fontWeight="semiBold">
            {t("syncOnboarding.deviceSelection.title")}
          </Text>
          <Text variant="large" color="neutral.c70" mb={8}>
            {t("syncOnboarding.deviceSelection.subtitle")}
          </Text>
          {devices.map(device => (
            <DiscoverCard
              key={device.id}
              event="Onboarding Device - Selection"
              eventProperties={{ id: device.id }}
              testID={`Onboarding Device - Selection|${device.id}`}
              title={getProductName(device.id)}
              titleProps={{ variant: "h4", fontSize: 16 }}
              subTitle={t("syncOnboarding.deviceSelection.brand")}
              subtitleFirst
              onPress={() => next(device.id)}
              labelBadge={t("syncOnboarding.deviceSelection.setupTime", {
                time: device.setupTime / 60000,
              })}
              cardProps={{ mx: 0, mb: 6 }}
              Image={
                <Illustration
                  size={130}
                  darkSource={setupLedgerImg}
                  lightSource={setupLedgerImg}
                />
              }
            />
          ))}
        </Flex>
      </ScrollListContainer>
      <TrackScreen category="Onboarding" name="SelectDevice" />
    </SafeAreaView>
  );
}

export default OnboardingStepDeviceSelection;
