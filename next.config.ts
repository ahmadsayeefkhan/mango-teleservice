import type { NextConfig } from "next";

// Permanent redirects from the legacy mango.com.bd URLs (see the content-strategy skill §3),
// so existing search rankings and bookmarks carry over to the new site.
const legacyRedirects: Array<[string, string]> = [
  ["/front/bandwidth", "/solutions/ip-transit"],
  ["/front/iplc", "/solutions/international-circuits"],
  ["/front/infrastructure", "/solutions/data-centre"],
  ["/front/digital-signature", "/solutions/digital-trust"],
  ["/front/manage-services", "/solutions/managed-services"],
  ["/front/software", "/solutions/software"],
  ["/front/training", "/solutions/training"],
  ["/mango-cloud", "/solutions/cloud"],
  ["/cloud/about", "/solutions/cloud"],
  ["/cloud/features", "/solutions/cloud"],
  ["/cloud/product", "/solutions/cloud"],
  ["/cloud/price", "/solutions/cloud#pricing"],
  ["/cloud/contact", "/contact"],
  ["/front/bod", "/company/leadership"],
  ["/front/management-team", "/company/leadership"],
  ["/front/mission-vision", "/company/about"],
  ["/front/history", "/company/milestones"],
  ["/front/partners", "/company/partners"],
  ["/front/projects", "/group"],
  ["/front/purple", "/group"],
  ["/front/platinum", "/group"],
  ["/front/electric-vehicle", "/group"],
  ["/front/solar", "/group"],
  ["/front/mango-lithium", "/group"],
  ["/front/motor-accessories", "/group"],
  ["/front/school", "/group"],
  ["/front/career", "/careers"],
  ["/front/contact", "/contact"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
