import React from 'react';
import { StyleSheet, View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const Skeleton = () => {
    return (
        <View style={styles.skeletonContainer}>
            <ContentLoader viewBox="0 0 380 50" foregroundColor={'#999'} backgroundColor="gray" style={styles.contentLoader} speed={1}>
                <Rect x="10" y="10" rx="4" ry="4" width="300" height="13" />
                <Rect x="10" y="30" rx="3" ry="3" width="250" height="10" />
            </ContentLoader>
        </View>
    );
}

const styles = StyleSheet.create({
    skeletonContainer: {
        marginBottom: 3,
        height: 70,
    },
    contentLoader: {
        opacity: 0.5
    },
});


export default Skeleton;