// utils/userAgentParser.ts
import { DevicePlatform } from "@prisma/client";

interface ParsedUserAgent {
  deviceType?: string;
  browser?: string;
  os?: string;
  platform?: DevicePlatform;
}



export const parseUserAgent = (userAgent: string): ParsedUserAgent => {
  if (!userAgent) return {};

  const ua = userAgent.toLowerCase();
  const result: ParsedUserAgent = {};

  // Detect OS
  if (ua.includes("windows")) {
    result.os = "Windows";
    result.platform = DevicePlatform.DESKTOP;
  } else if (ua.includes("mac os")) {
    result.os = "macOS";
    result.platform = DevicePlatform.DESKTOP;
  } else if (ua.includes("android")) {
    result.os = "Android";
    result.platform = DevicePlatform.ANDROID;
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    result.os = ua.includes("ipad") ? "iPadOS" : "iOS";
    result.platform = DevicePlatform.IOS;
  } else if (ua.includes("linux")) {
    result.os = "Linux";
    result.platform = DevicePlatform.DESKTOP;
  }

  // Detect Browser
  if (ua.includes("edg/")) {
    result.browser = "Edge";
  } else if (ua.includes("chrome/") && !ua.includes("edg/")) {
    result.browser = "Chrome";
  } else if (ua.includes("safari/") && !ua.includes("chrome/")) {
    result.browser = "Safari";
  } else if (ua.includes("firefox/")) {
    result.browser = "Firefox";
  } else if (ua.includes("opera/") || ua.includes("opr/")) {
    result.browser = "Opera";
  }

  // Detect Device Type
  if (ua.includes("mobile")) {
    result.deviceType = "Mobile";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    result.deviceType = "Tablet";
  } else {
    result.deviceType = "Desktop";
  }

  // Override platform for web if not already set
  if (!result.platform) {
    result.platform = DevicePlatform.WEB;
  }

  return result;
};

