import React, { useEffect, useMemo } from "react";
import { useWindowDimensions, ViewProps } from "react-native";
import {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { AnimationContainer } from "./styles";

interface CardAnimationProps extends ViewProps {
  children: React.ReactNode;
}

export function CardAnimation({ children, ...rest }: CardAnimationProps) {
  const { width: displayWidth } = useWindowDimensions();
  const cardOpacity = useSharedValue(0);
  const offset = useMemo(() => 0.25 * displayWidth, []);
  // ! Without interpolate
  // const cardOffset = useSharedValue(offset);
  const cardOffset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(cardOpacity.value, [0, 50], [0, 1]),
      // ! Without interpolate
      // transform: [
      //   {
      //     translateX: cardOffset.value,
      //   },
      // ],
      transform: [
        {
          translateX: interpolate(
            cardOffset.value,
            [0, 50],
            [offset, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  useEffect(() => {
    cardOpacity.value = withTiming(50, {
      duration: 1000,
      easing: Easing.ease,
    });
    // ! Without interpolate
    // cardOffset.value = withTiming(0, {
    //   duration: 1000,
    //   easing: Easing.bounce,
    // });
    cardOffset.value = withTiming(50, {
      duration: 1000,
      easing: Easing.bounce,
    });
  }, []);

  return (
    <AnimationContainer {...rest} style={animatedStyle}>
      {children}
    </AnimationContainer>
  );
}
