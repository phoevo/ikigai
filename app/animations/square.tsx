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

const SIZE = 200; // Size of the square
const CIRCLE_RADIUS = 20; // Radius of the circle
const DURATION = 8000; // Time to complete one loop

const Square = () => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: DURATION, easing: Easing.linear }),
      -1, // Infinite repeat
      false
    );
  }, []);

  const animatedX = useDerivedValue(() => {
    const t = progress.value * 4; // Normalize time to 4 sides
    if (t <= 1) return SIZE * t;
    if (t <= 2) return SIZE;
    if (t <= 3) return SIZE * (3 - t);
    return 0;
  });

  const animatedY = useDerivedValue(() => {
    const t = progress.value * 4;
    if (t <= 1) return 0;
    if (t <= 2) return SIZE * (t - 1);
    if (t <= 3) return SIZE;
    return SIZE * (4 - t);
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
    <View style={{width: 380, height: 380, justifyContent: "flex-end", alignItems: "flex-end", backgroundColor: "#23b994", borderRadius: 12}}>
    <View style={{width: 290, height: 290,
    }}>
      <View
        style={{
          width: SIZE,
          height: SIZE,
          borderWidth: 2,
          borderColor: "cyan",
          backgroundColor:"teal",
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
