# Final QA: every route at desktop (motion, scrolled) and mobile (static), capturing console + overflow.
$ErrorActionPreference = "Continue"
Set-Location "C:\Users\asufi\Desktop\Mango Teleservice\website"
$base = "http://localhost:3100"
$out = "shots\final"
New-Item -ItemType Directory -Force $out | Out-Null
$routes = @("/","/solutions","/solutions/ip-transit","/solutions/international-circuits","/solutions/enterprise-internet","/solutions/data-connectivity","/solutions/data-centre","/solutions/cloud","/solutions/digital-trust","/solutions/managed-services","/solutions/software","/solutions/training","/network","/company/about","/company/leadership","/company/milestones","/company/partners","/company/newsroom","/group","/industries","/industries/isps-operators","/industries/banking-finance","/industries/government","/industries/enterprise","/industries/education","/industries/digital-business","/resources/insights","/resources/insights/what-is-an-international-internet-gateway","/resources/case-studies","/resources/case-studies/nbr-training","/resources/faq","/careers","/careers/senior-network-engineer-bgp-ip-core","/support","/contact","/contact/thank-you","/legal/privacy","/this-page-does-not-exist")
foreach ($r in $routes) {
  $name = if ($r -eq "/") { "home" } else { $r.Trim("/").Replace("/", "_") }
  "=== $r"
  node tools/shot.mjs "$base$r" "$out\$name-1440.png" 1440 900 --full --scroll --wait=3500 2>&1
  node tools/shot.mjs "$base$r`?static=1" "$out\$name-390.png" 390 844 --full --mobile --wait=2500 2>&1
}
"DONE"
