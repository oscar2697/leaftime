import { COLORS } from '@/constants/theme'
import { View, Text, ActivityIndicator } from 'react-native'

const Loader = () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.background,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ActivityIndicator
                size="large"
                color={COLORS.primary}
            />
        </View>
    )
}

export default Loader