import * as Linking from "expo-linking";
import { useEffect } from "react";
import { View } from "react-native";

export default function OAuthRedirect() {
  const url = Linking.useURL();

  useEffect(() => {
    if (!url) return;

    console.log("OAUTH URL RECEIVED:", url);

    const parsed = Linking.parse(url);
    console.log("PARSED:", JSON.stringify(parsed, null, 2));

    const code = parsed.queryParams?.code as string;
    const state = parsed.queryParams?.state as string;
    const error = parsed.queryParams?.error as string;

    // if (error) {
    //   console.log("AUTH ERROR:", error);
    //   router.replace("/login");
    //   return;
    // }

    // if (code) {
    //   console.log("AUTH CODE RECEIVED:", code);
    //   router.replace({
    //     pathname: "/login",
    //     params: { code, state },
    //   });
    // }
  }, [url]);

  return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
}
