import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filename) {
    const fullPath = path.join(root, filename);
    if (!fs.existsSync(fullPath)) return;

    for (const line of fs.readFileSync(fullPath, "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const separator = trimmed.indexOf("=");
        if (separator < 0) continue;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = value;
    }
}

loadEnvFile(".env");
loadEnvFile(".env.production");
loadEnvFile(".env.local");

const siteUrl = (process.env.VITE_SITE_URL || "http://jhr.com.dedi8785.your-server.de").replace(/\/$/, "");
const drupalUrl = (process.env.VITE_DRUPAL_URL || "http://backend.jhr.com.dedi8785.your-server.de").replace(/\/$/, "");

const STATIC_PATHS = [
    "/",
    "/about",
    "/welcome-speech",
    "/board-directors",
    "/organization-chart",
    "/general-managers",
    "/stations",
    "/services/trips",
    "/services/venue-booking",
    "/services/investment",
    "/services/cargo",
    "/services/museum",
    "/legislations/laws",
    "/legislations/regulations",
    "/info-center/projects",
    "/info-center/budget",
    "/info-center/annual-reports",
    "/info-center/agreements",
    "/news",
    "/gallery",
    "/events",
    "/conferences",
    "/contact-us",
    "/jobs",
    "/tenders",
    "/complaints",
    "/freedom-of-information",
    "/code-of-conduct",
    "/sitemap",
    "/faq",
    "/useful-links",
    "/search",
];

function isPublicPath(value) {
    if (!value || typeof value !== "string") return false;
    if (!value.startsWith("/") || value.startsWith("//")) return false;

    const pathOnly = value.split("?")[0].split("#")[0];
    if (pathOnly.includes("..")) return false;

    const blocked = [
        /^\/api(\/|$)/i,
        /^\/admin(\/|$)/i,
        /^\/user(\/|$)/i,
        /^\/jsonapi(\/|$)/i,
        /^\/node(\/|$)/i,
        /^\/webform(\/|$)/i,
        /^\/form(\/|$)/i,
        /^\/(en|ar)(\/|$)/i,
    ];

    return !blocked.some((pattern) => pattern.test(pathOnly));
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

async function fetchCollection(resourcePath) {
    const items = [];
    let nextUrl = `${drupalUrl}${resourcePath}`;

    for (let page = 0; page < 20 && nextUrl; page += 1) {
        const response = await fetch(nextUrl, {
            headers: { Accept: "application/vnd.api+json" },
        });
        if (!response.ok) {
            throw new Error(`${response.status} ${nextUrl}`);
        }
        const payload = await response.json();
        items.push(...(payload.data || []));
        nextUrl = payload.links?.next?.href || "";
    }

    return items;
}

function mediaDetailPath(node) {
    const classification = String(node.attributes?.field_media_center_classificatio || "").toLowerCase();
    const routes = {
        news: "/news/",
        events: "/events/",
        conferences: "/conferences/",
    };
    const prefix = routes[classification];
    return prefix ? `${prefix}${node.id}` : "";
}

async function collectDynamicPaths() {
    const paths = [];
    const jobs = [
        {
            label: "basic pages",
            path: "/jsonapi/node/basic_page?page[limit]=50",
            map: (node) => node.attributes?.field_link || "",
        },
        {
            label: "media center",
            path: "/jsonapi/node/media_center?page[limit]=50&filter[status]=1",
            map: mediaDetailPath,
        },
        {
            label: "galleries",
            path: "/jsonapi/node/photo_gallery?page[limit]=50&filter[status]=1",
            map: (node) => `/gallery/${node.id}`,
        },
        {
            label: "jobs",
            path: "/jsonapi/node/jobs?page[limit]=50&filter[status]=1",
            map: (node) => `/jobs/${node.id}`,
        },
        {
            label: "tenders",
            path: "/jsonapi/node/tenders?page[limit]=50&filter[status]=1",
            map: (node) => `/tenders/${node.id}`,
        },
        {
            label: "projects",
            path: "/jsonapi/node/projects?page[limit]=50&filter[status]=1",
            map: (node) => `/info-center/projects/${node.id}`,
        },
        {
            label: "stations",
            path: "/jsonapi/node/almhtat?page[limit]=50&filter[status]=1",
            map: (node) => `/stations/${node.id}`,
        },
    ];

    for (const job of jobs) {
        try {
            const nodes = await fetchCollection(job.path);
            const mapped = nodes.map(job.map).filter(isPublicPath);
            paths.push(...mapped);
            console.log(`sitemap: ${job.label} ${mapped.length}`);
        } catch (error) {
            console.warn(`sitemap: skipped ${job.label} (${error.message})`);
        }
    }

    return paths;
}

const dynamicPaths = await collectDynamicPaths();
const uniquePaths = [...new Set([...STATIC_PATHS, ...dynamicPaths].filter(isPublicPath))];

const body = uniquePaths
    .map((pagePath) => `  <url><loc>${escapeXml(`${siteUrl}${pagePath === "/" ? "/" : pagePath}`)}</loc></url>`)
    .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outputPath = path.join(root, "public", "sitemap.xml");
fs.writeFileSync(outputPath, xml, "utf8");
console.log(`sitemap: wrote ${uniquePaths.length} urls for ${siteUrl}`);
