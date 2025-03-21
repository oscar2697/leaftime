import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { styles } from '@/styles/auth.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'

const login = () => {
    const { startSSOFlow } = useSSO()
    const router = useRouter()

    const handleGoolgeSignIn = async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google' })

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                router.replace('/(tabs)');
            } 
        } catch (error) {
            console.error("OAuth error:", error)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                    <Ionicons name='leaf' size={32} color={COLORS.primary} />
                </View>

                <Text style={styles.appName}>leaftime</Text>
                <Text style={styles.tagline}>don't miss nothing!</Text>
            </View>

            <View style={styles.illustrationContainer}>
                <Image
                    source={require('../../assets/images/auth.png')}
                    style={styles.illustration}
                    resizeMode='cover'
                />
            </View>

            <View style={styles.loginSection}>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoolgeSignIn}
                    activeOpacity={0.9}
                >
                    <View style={styles.googleIconContainer}>
                        <Ionicons name='logo-google' size={24} color={COLORS.surface} />
                    </View>
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>By signing up, you agree to our Terms and Conditions</Text>
            </View>
        </View>
    )
}

export default login