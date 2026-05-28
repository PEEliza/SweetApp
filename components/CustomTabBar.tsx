import React, { useEffect } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const BAR_WIDTH = width * 0.9;
const TAB_COUNT = 4;
const TAB_WIDTH = BAR_WIDTH / TAB_COUNT;

export function CustomTabBar({
    state,
    descriptors,
    navigation,
}: any) {

    const translateX = useSharedValue(0);

    useEffect(() => {
        translateX.value = withSpring(
            state.index * TAB_WIDTH + TAB_WIDTH / 2 - 28,
            {
                damping: 15,
                stiffness: 120,
            }
        );
    }, [state.index]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    // ORDEN FORZADO
    const orderedRoutes = [
        "index",
        "crear",
        "favoritos",
        "perfil",
    ];

    const routes = orderedRoutes
        .map((name) =>
            state.routes.find((r: any) => r.name === name)
        )
        .filter(Boolean);

    return (
        <View style={styles.outerContainer}>
            <View style={styles.barContainer}>

                {/* círculo */}
                <Animated.View
                    style={[styles.indicator, animatedStyle]}
                />

                {/* tabs */}
                <View style={styles.content}>
                    {routes.map((route: any, index: number) => {

                        const { options } =
                            descriptors[route.key];

                        const isFocused =
                            state.index ===
                            state.routes.findIndex(
                                (r: any) => r.key === route.key
                            );

                        const onPress = () => {
                            navigation.navigate(route.name);
                        };

                        return (
                            <Pressable
                                key={route.key}
                                onPress={onPress}
                                style={styles.tabItem}
                            >
                                <View style={styles.iconWrapper}>
                                    {options.tabBarIcon?.({
                                        color: isFocused
                                            ? '#FFFFFF'
                                            : '#8E8E93',
                                        focused: isFocused,
                                        size: 26,
                                    })}
                                </View>
                            </Pressable>
                        );
                    })}
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        bottom: 25,
        width: '100%',
        alignItems: 'center',
    },

    barContainer: {
        width: BAR_WIDTH,
        height: 72,
        backgroundColor: '#151515',
        borderRadius: 40,
        justifyContent: 'center',

        elevation: 10,
        shadowColor: '#d6834c',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },

    content: {
        flexDirection: 'row',
        height: '100%',
    },

    indicator: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#d6834c',
        top: 8,
        zIndex: 0,
    },

    tabItem: {
        width: TAB_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconWrapper: {
        zIndex: 10,
    },
});