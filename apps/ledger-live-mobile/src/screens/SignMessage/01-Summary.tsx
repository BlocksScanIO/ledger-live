import React, { useCallback, useMemo, useState, memo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Trans } from "react-i18next";
import type { TypedMessageData } from "@ledgerhq/live-common/families/ethereum/types";
import type { MessageData } from "@ledgerhq/live-common/hw/signMessage/types";
import {
  getAccountCurrency,
  getAccountName,
  getMainAccount,
} from "@ledgerhq/live-common/account/index";
import {
  isEIP712Message,
  getNanoDisplayedInfosFor712,
} from "@ledgerhq/live-common/families/ethereum/hw-signMessage";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { accountScreenSelector } from "../../reducers/accounts";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import Button from "../../components/Button";
import WalletIcon from "../../icons/Wallet";
import LText from "../../components/LText";
import ParentCurrencyIcon from "../../components/ParentCurrencyIcon";

const forceInset = {
  bottom: "always",
};
type Props = {
  navigation: any;
  route: {
    params: RouteParams;
  };
};

export type RouteParams = {
  accountId: string;
  message: MessageData | TypedMessageData;
  onConfirmationHandler?: (_: MessageData | TypedMessageData) => void;
  onFailHandler?: (_: Error) => void;
  currentNavigation?: string;
  nextNavigation?: string;
};
const defaultParams = {
  currentNavigation: ScreenName.SignSummary,
  nextNavigation: ScreenName.SignSelectDevice,
};

const MessageProperty = memo(
  ({
    label,
    value,
  }: {
    label: string;
    value: string | string[] | null | undefined;
  }) => {
    const { colors } = useTheme();

    if (!value) return <></>;

    return (
      <View style={styles.messageProperty}>
        <LText style={styles.messagePropertyLabel} bold>
          {label}
        </LText>
        <LText
          style={[
            styles.messagePropertyValue,
            {
              color: colors.grey,
            },
          ]}
        >
          {typeof value === "string" ? (
            value
          ) : (
            <View style={styles.propertiesList}>
              {value.map((v, i) => (
                <LText
                  style={[
                    styles.messagePropertyValue,
                    {
                      color: colors.grey,
                    },
                  ]}
                  key={i}
                >{`${v}${i < value.length - 1 ? "," : ""}`}</LText>
              ))}
            </View>
          )}
        </LText>
      </View>
    );
  },
);
MessageProperty.displayName = "MessageProperty";

const MessageProperties = memo(
  (props: { properties: { label: string; value: string | string[] }[] }) => {
    const { properties } = props;
    return (
      <View>
        {properties.map((p, i) => (
          <MessageProperty key={i} {...p} />
        ))}
      </View>
    );
  },
);
MessageProperties.displayName = "MessageProperties";

function SignSummary({ navigation, route: initialRoute }: Props) {
  const { colors } = useTheme();
  const route = {
    ...initialRoute,
    params: { ...defaultParams, ...initialRoute.params },
  };
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const mainAccount = account && getMainAccount(account, parentAccount);
  const { nextNavigation, message: messageData } = route.params;
  const navigateToNext = useCallback(() => {
    navigation.navigate(nextNavigation, { ...route.params });
  }, [navigation, nextNavigation, route.params]);
  const onContinue = useCallback(() => {
    navigateToNext();
  }, [navigateToNext]);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    message,
    fields,
  }: {
    message?: string | null;
    fields?: ReturnType<typeof getNanoDisplayedInfosFor712>;
  } = useMemo(() => {
    try {
      if (mainAccount?.currency.family === "ethereum") {
        const parsedMessage =
          typeof messageData.message === "string"
            ? JSON.parse(messageData.message)
            : messageData.message;

        return {
          fields: isEIP712Message(messageData.message)
            ? getNanoDisplayedInfosFor712(parsedMessage)
            : null,
        };
      }
      throw new Error();
    } catch (e) {
      return {
        message:
          typeof messageData.message === "string"
            ? messageData.message
            : messageData.message.toString(),
      };
    }
  }, [mainAccount?.currency.family, messageData.message]);

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
        },
      ]}
      forceInset={forceInset}
    >
      <TrackScreen category="SignMessage" name="Summary" />
      <View style={styles.body}>
        <View style={styles.fromContainer}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.lightLive,
              },
            ]}
          >
            <WalletIcon color={colors.live} size={16} />
          </View>
          <View style={styles.fromInnerContainer}>
            <LText style={styles.from}>
              <Trans i18nKey="walletconnect.from" />
            </LText>
            <View style={styles.headerContainer}>
              <View style={styles.headerIconContainer}>
                <ParentCurrencyIcon
                  size={18}
                  currency={mainAccount && getAccountCurrency(mainAccount)}
                />
              </View>
              <LText semiBold secondary numberOfLines={1}>
                {mainAccount && getAccountName(mainAccount)}
              </LText>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.separator,
            {
              backgroundColor: colors.separator,
            },
          ]}
        />
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.messageContainer}>
            {fields ? (
              <MessageProperties properties={fields} />
            ) : (
              <MessageProperty label={"message"} value={message} />
            )}
          </View>
          {fields ? (
            <View>
              <Button
                type="color"
                onPress={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "- Hide full message" : "+ Show full message"}
              </Button>
              {showAdvanced ? (
                <LText
                  style={[
                    styles.advancedMessageArea,
                    {
                      backgroundColor: colors.pillActiveBackground,
                    },
                  ]}
                >
                  {typeof messageData.message === "string"
                    ? `"${messageData.message}"`
                    : JSON.stringify(messageData.message, null, 2)}
                </LText>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button
          event="SummaryContinue"
          type="primary"
          title={<Trans i18nKey="common.continue" />}
          containerStyle={styles.continueButton}
          onPress={onContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
  },
  body: {
    flex: 1,
  },
  fromContainer: {
    marginBottom: 30,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  headerIconContainer: {
    marginRight: 8,
    justifyContent: "center",
  },
  fromInnerContainer: {
    marginLeft: 16,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  from: {
    opacity: 0.5,
  },
  messageContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  propertiesList: {
    marginBottom: 10,
  },
  messageProperty: {
    marginBottom: 20,
  },
  messagePropertyLabel: {
    fontSize: 12,
  },
  messagePropertyValue: {
    marginTop: 10,
    fontSize: 12,
  },
  advancedMessageArea: {
    marginTop: 20,
    fontSize: 9,
    fontFamily: "Courier New",
    padding: 20,
  },
  message: {
    opacity: 0.5,
    marginBottom: 11,
    marginTop: 33,
  },
  separator: {
    height: 1,
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  continueButton: {
    alignSelf: "stretch",
  },
});
export default SignSummary;
