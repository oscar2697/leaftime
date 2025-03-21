import { useAuth } from "@clerk/clerk-expo"
import { useSegments, useRouter, Stack } from "expo-router"
import { useEffect } from "react"

const InitialLayout = () => {
    const { isSignedIn, isLoaded } = useAuth()
    const segments = useSegments()
    const router = useRouter()

    useEffect(() => {
        if (!isLoaded) return

        const inAuthScreen = segments[0] === '(auth)'

        if (!isSignedIn && !inAuthScreen) router.replace('/(auth)/login')
        else if (isSignedIn && inAuthScreen) router.replace('/(tabs)')
    }, [isLoaded, isSignedIn, segments])

    if (!isLoaded) return null

    return <Stack screenOptions={{ headerShown: false }} />
}

export default InitialLayout