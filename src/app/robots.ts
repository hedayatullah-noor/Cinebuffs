import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin",
                    "/moderator",
                    "/profile",
                    "/login",
                    "/signup",
                    "/forgot-password",
                    "/reset-password",
                    "/api/",
                ],
            },
        ],
        sitemap: "https://cinebuffs.org/sitemap.xml",
    };
}
