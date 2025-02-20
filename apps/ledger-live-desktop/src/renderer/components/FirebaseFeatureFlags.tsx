import React, { useCallback, useState, ReactNode } from "react";
import isEqual from "lodash/isEqual";
import semver from "semver";
import { FeatureFlagsProvider } from "@ledgerhq/live-common/featureFlags/index";
import { Feature, FeatureId } from "@ledgerhq/types-live";
import { getValue } from "firebase/remote-config";

import { formatFeatureId, useFirebaseRemoteConfig } from "./FirebaseRemoteConfig";

const checkFeatureFlagVersion = (feature: Feature) => {
  if (
    feature.enabled &&
    feature.desktop_version &&
    !semver.satisfies(__APP_VERSION__, feature.desktop_version)
  ) {
    return {
      enabledOverriddenForCurrentDesktopVersion: true,
      ...feature,
      enabled: false,
    };
  }
  return feature;
};

type Props = {
  children?: ReactNode;
};

export const FirebaseFeatureFlagsProvider = ({ children }: Props): JSX.Element => {
  const remoteConfig = useFirebaseRemoteConfig();
  const [localOverrides, setLocalOverrides] = useState({});

  const getFeature = useCallback(
    (key: FeatureId, allowOverride = true): Feature | null => {
      if (!remoteConfig) {
        return null;
      }

      try {
        // Nb prioritize local overrides
        if (allowOverride && localOverrides[key]) {
          return checkFeatureFlagVersion(localOverrides[key]);
        }

        const value = getValue(remoteConfig, formatFeatureId(key));
        const feature: Feature = JSON.parse(value.asString());

        return checkFeatureFlagVersion(feature);
      } catch (error) {
        console.error(`Failed to retrieve feature "${key}"`);
        return null;
      }
    },
    [localOverrides, remoteConfig],
  );

  const overrideFeature = useCallback(
    (key: FeatureId, value: Feature): void => {
      const actualRemoteValue = getFeature(key, false);
      if (!isEqual(actualRemoteValue, value)) {
        const overridenValue = { ...value, overridesRemote: true };
        setLocalOverrides(currentOverrides => ({ ...currentOverrides, [key]: overridenValue }));
      } else {
        setLocalOverrides(currentOverrides => ({ ...currentOverrides, [key]: undefined }));
      }
    },
    [getFeature],
  );

  const resetFeature = (key: FeatureId): void => {
    setLocalOverrides(currentOverrides => ({ ...currentOverrides, [key]: undefined }));
  };

  return (
    <FeatureFlagsProvider
      getFeature={getFeature}
      overrideFeature={overrideFeature}
      resetFeature={resetFeature}
    >
      {children}
    </FeatureFlagsProvider>
  );
};
