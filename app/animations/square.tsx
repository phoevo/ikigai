import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing
} from "react-native-reanimated";

const SIZE = 200;
const CIRCLE_RADIUS = 20;
const MOVE_DURATION = 3000;
const PAUSE_DURATION = 2000;
const TOTAL_DURATION = (MOVE_DURATION + PAUSE_DURATION) * 4; // 20 seconds for full loop

const Square = () => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: TOTAL_DURATION, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedX = useDerivedValue(() => {
    const t = progress.value * 8; // Now 8 stages (4 moves + 4 pauses)
    if (t < 1) return SIZE * t; // Move right
    if (t < 2) return SIZE;      // Pause
    if (t < 3) return SIZE;      // Move down
    if (t < 4) return SIZE;      // Pause
    if (t < 5) return SIZE * (5 - t); // Move left
    if (t < 6) return 0;         // Pause
    if (t < 7) return 0;         // Move up
    return 0;                   // Pause
  });

  const animatedY = useDerivedValue(() => {
    const t = progress.value * 8;
    if (t < 1) return 0;         // Move right
    if (t < 2) return 0;         // Pause
    if (t < 3) return SIZE * (t - 2); // Move down
    if (t < 4) return SIZE;      // Pause
    if (t < 5) return SIZE;      // Move left
    if (t < 6) return SIZE;      // Pause
    if (t < 7) return SIZE * (7 - t); // Move up
    return 0;                   // Pause
  });


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: animatedX.value - CIRCLE_RADIUS },
        { translateY: animatedY.value - CIRCLE_RADIUS },
      ],
    };
  });

  return (
    <View style={{ width: 380, height: 380, justifyContent: "flex-end", alignItems: "flex-end", backgroundColor: "#23b994", borderRadius: 12 }}>
      <View style={{ width: 290, height: 290 }}>
        <View
          style={{
            width: SIZE,
            height: SIZE,
            borderWidth: 2,
            borderColor: "cyan",
            backgroundColor: "teal",
            position: "absolute",
          }}
        />
        <Animated.View
          style={[
            {
              width: CIRCLE_RADIUS * 2,
              height: CIRCLE_RADIUS * 2,
              borderRadius: CIRCLE_RADIUS,
              borderWidth: 2,
              borderColor: "rgb(0 230 230)",
              backgroundColor: "#008B8B",
              position: "absolute",
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

export default Square;
