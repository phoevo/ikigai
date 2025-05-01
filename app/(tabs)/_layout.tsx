import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabsLayout() {
  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: 'white',
    headerStyle: {
      backgroundColor: '#975BFF',
    },
    headerShadowVisible: false,
    headerTintColor: 'white',
    tabBarStyle: {
    backgroundColor: '#975BFF',
    },
  }}
>

      <Tabs.Screen
        name="index"
        options={{
          title: 'AI',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'body-sharp' : 'body-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: 'Question',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="student"
        options={{
          title: 'Student',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
