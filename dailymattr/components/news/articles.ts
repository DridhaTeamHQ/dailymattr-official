// Story bodies for the sample stories (stories.ts), keyed by slug: the key points and source
// each story carries on the old site (https://www.dailymattr.com/news/<slug>). UI only, until the
// CMS feed provides them.

export type StoryBody = {
  /** The story in short: three or four key points. */
  points: string[]
  source: { label: string; url: string }
}

export const storyBodies: Record<string, StoryBody> = {
  "nara-lokesh-steps-in-after-girl-students-report-eve-teasing-outside-andhra-20245": {
    points: [
      "Education Minister Nara Lokesh directed Tirupati district officials to act on students' complaints.",
      "Railway Koduru police visited the school and spoke to girl students and teachers.",
      "Police assured students of their safety and urged them to report harassment without fear.",
      "The district SP warned of strict action against those involved in eve-teasing.",
    ],
    source: {
      label: "deccanchronicle.com",
      url: "https://www.deccanchronicle.com/southern-states/andhra-pradesh/nara-lokesh-responds-to-eve-teasing-complaints-by-girl-students-in-railway-koduru-2006571",
    },
  },
  "arunachal-groups-urge-shah-to-scrap-the-proposed-11-200-mw-siang-mega-dam-20244": {
    points: [
      "Arunachal groups urge Amit Shah to scrap the proposed 11,200 MW Siang mega dam project.",
      "Indigenous groups fear the project threatens ancestral lands, livelihoods, cultural heritage and communities along the Siang river.",
      "Government backs the project as a strategic safeguard against China’s planned upstream hydropower dam in Tibet.",
      "Siang Upper Multipurpose Project remains at pre-feasibility stage, amid local protests and resistance to surveys.",
    ],
    source: {
      label: "economictimes.indiatimes.com",
      url: "https://economictimes.indiatimes.com/news/india/arunachal-groups-urge-amit-shah-to-scrap-11200-mw-siang-mega-dam-project/articleshow/136045382.cms",
    },
  },
  "caqm-targets-15-20-percent-pollution-reduction-in-delhi-ncr-by-2027-fixes-20243": {
    points: [
      "CAQM has set a target to cut pollution levels across Delhi-NCR by 15-20% in 2027.",
      "States must prepare district-level action plans for the first time to tackle air pollution.",
      "Officials will be identified by name and held accountable for meeting pollution-control targets.",
      "The plan aims to address emissions from vehicles, industries, construction dust and stubble burning.",
    ],
    source: {
      label: "hindustantimes.com",
      url: "https://www.hindustantimes.com/india-news/1520-pollution-cut-district-level-plans-accountability-of-officials-part-of-caqm-s-2027-push-for-delhi-ncr-101795244231635.html",
    },
  },
  "15-dead-over-180-hospitalised-after-suspected-toxic-liquor-consumption-in-20242": {
    points: [
      "At least 15 people died and over 180 were hospitalised after suspected liquor poisoning in Manipur's Chandel.",
      "The deaths occurred from November 18 to 20, and police said the suspected liquor came from Sugnu in Kakching.",
      "Officials said the exact cause is unconfirmed and warned people against drinking liquor from suspicious sources.",
      "Manipur CM Yumnam Khemchand Singh visited hospitals, ordered an enquiry and sent a medical team to Chandel.",
    ],
    source: {
      label: "indiatoday.in",
      url: "https://www.indiatoday.in/cities/other-cities/story/manipur-spurious-liquor-deaths-eight-dead-140-reach-chandel-hospital-3043436-2026-11-20",
    },
  },
  "deepinder-goyals-temple-puts-the-spotlight-on-indias-growing-health-tech-20241": {
    points: [
      "Deepinder Goyal's ₹85,000 Temple wearable has brought attention to India's growing health-focused wearables market.",
      "Unlike basic fitness trackers, devices such as smart rings and screenless bands offer continuous health monitoring.",
      "Indian brands like Ultrahuman, Gabit and Neosapien are competing with personalised health insights and tracking features.",
      "India's wearable market is shifting towards premium devices, driven by demand for preventive healthcare and better health data.",
    ],
    source: {
      label: "financialexpress.com",
      url: "https://www.financialexpress.com/life/technology-temple-shines-light-on-health-tech-wearables-4390303/",
    },
  },
  "where-was-siraj-ravi-shastri-questions-gambhir-and-gills-pace-bowling-selection-20240": {
    points: [
      "Ravi Shastri questioned Gautam Gambhir and Shubman Gill over Mohammed Siraj’s omission from India’s playing XI.",
      "Shastri raised the question ‘Where was Siraj?’, highlighting the pacer’s ability, experience and effectiveness in challenging conditions.",
      "He questioned India’s pace-bowling choices, pointing to the difficulty of consistently clocking speeds around 140 kmph among selected pacers.",
      "India fielded Bumrah, Prasidh Krishna, Akash Deep and Anshul Kamboj against New Zealand, leaving Siraj out.",
    ],
    source: {
      label: "sports.ndtv.com",
      url: "https://sports.ndtv.com/cricket/ravi-shastri-drops-burning-question-on-gautam-gambhir-shubman-gill-amid-1st-new-zealand-test-where-was-mohammed-siraj-12349874",
    },
  },
  "kapil-dev-reacts-to-congress-mps-bias-allegations-over-sirajs-omission-against-20239": {
    points: [
      "Former India captain Kapil Dev responded to Congress MP Imran Masood’s allegations of discrimination over Mohammed Siraj’s omission.",
      "Kapil said selectors, the manager and captain were responsible for picking the playing XI, not outsiders.",
      "He praised the selection system, saying Indian cricket’s overall progress mattered more than individual preferences or criticism.",
      "Masood alleged Siraj was overlooked despite good performances, claiming his name was the reason behind his exclusion.",
    ],
    source: {
      label: "sports.ndtv.com",
      url: "http://sports.ndtv.com/new-zealand-vs-india-2026-27/kapil-devs-verdict-on-mohammed-siraj-exclusion-in-1st-new-zealand-test-amid-congress-leaders-allegations-12354850",
    },
  },
  "melania-trump-talks-peace-amid-gaza-conflict-at-premiere-of-her-amazon-series-20238": {
    points: [
      "Melania Trump called for global peace when asked about children affected by the conflicts in Gaza and Israel.",
      "Speaking at the New York premiere of her Amazon Prime Video series, she said everyone should live in harmony and peace.",
      "Asked how peace could be achieved, she said she hoped people could \"come together\".",
      "The two-part series, titled Melania: The Series, offers a behind-the-scenes look at her life and role as US First Lady.",
    ],
    source: {
      label: "variety.com",
      url: "https://variety.com/2026/tv/news/melania-trump-series-gaza-israel-children-peace-amazon-1236954718/",
    },
  },
  "congress-says-modi-shah-still-seek-supertainted-two-thirds-majority-to-push-20237": {
    points: [
      "Congress says PM Modi and Amit Shah are still seeking a “supertainted” two-thirds majority for delimitation.",
      "Congress general secretary Jairam Ramesh questioned whether the government plans to revive the defeated delimitation bill.",
      "He alleged the earlier bill failed to honour commitments Amit Shah reportedly made during opposition consultations.",
      "Ramesh urged the government to share its proposal transparently and convene an all-party meeting on delimitation.",
    ],
    source: {
      label: "thehindu.com",
      url: "https://www.thehindu.com/news/national/pm-hm-still-searching-for-supertainted-two-thirds-majority-for-delimitation-bill-says-congress/article71727506.ece",
    },
  },
  "indias-fake-university-list-grows-from-20-to-32-in-three-years-18-old-names-20236": {
    points: [
      "The University Grants Commission's UGC fake university list has grown from 20 in 2023 to 32 in 2026.",
      "18 of the 20 institutions flagged in March 2023 continue to feature on the latest list.",
      "Delhi has the highest number with 12 fake universities, followed by Uttar Pradesh with four.",
      "The fresh November 17 advisory follows Supreme Court directions to warn students against unrecognised institutions.",
    ],
    source: {
      label: "timesofindia.indiatimes.com",
      url: "https://timesofindia.indiatimes.com/india/fake-university-list-grows-from-20-to-32-in-3-years-18-old-names-still-on-it/articleshow/136039662.cms",
    },
  },
  "tata-trusts-chairman-noel-tata-seeks-board-nrc-meeting-recordings-amid-chairman-20235": {
    points: [
      "Tata Trusts chairman Noel Tata again sought recordings of Tata Sons' September 17 meeting.",
      "He sought nomination committee recordings concerning N Chandrasekaran's possible reappointment as Tata Sons chairman.",
      "Noel alleged nominee director Venu Srinivasan had a conflict of interest and should abstain from voting.",
      "Tata Sons previously denied any conflict over alleged business dealings involving Srinivasan's company and Chandrasekaran's son's firm.",
    ],
    source: {
      label: "ndtv.com",
      url: "https://www.ndtv.com/india-news/noel-tata-seeks-board-meeting-recordings-amid-tata-chairman-row-12357691",
    },
  },
  "52-lakh-weddings-rs-7-5-lakh-crore-business-indias-big-fat-wedding-season-is-20234": {
    points: [
      "India is expecting 52 lakh weddings between November 21 and December 15, generating business worth ₹7.5 lakh crore.",
      "Delhi-NCR alone is projected to host 5 lakh weddings, contributing nearly ₹2.5 lakh crore in business.",
      "Jewellery, apparel and textiles will drive retail spending, while catering, hotels and event planning boost services.",
      "The 25-day wedding season is expected to create 1.25 crore temporary, seasonal and part-time jobs.",
    ],
    source: {
      label: "ndtv.com",
      url: "https://www.ndtv.com/lifestyle/india-set-for-biggest-ever-wedding-economy-boom-worth-rs-7-5-lakh-crore-12348133",
    },
  },
  "india-reach-486-4-on-day-3-against-new-zealand-take-118-run-lead-in-first-test-20232": {
    points: [
      "India ended Day 3 of the first Test at 486/4 on Saturday, taking a 118-run lead over New Zealand's 368.",
      "KL Rahul led India's batting with a brilliant 136, while Shubman Gill narrowly missed a century with 98.",
      "Devdutt Padikkal scored 80 and shared a 165-run partnership with Rahul to strengthen India's position.",
      "Rishabh Pant remained unbeaten on 55 as India's top five batters all scored fifties, a first in an away Test.",
    ],
    source: {
      label: "ap7am.com",
      url: "https://www.ap7am.com/en/139875/1st-test-rahul-gill-padikkal-pant-propel-india-to-118-run-lead-over-new-zealand",
    },
  },
  "pm-modi-marks-iit-kharagpurs-75-years-says-india-make-everything-from-chips-to-20230": {
    points: [
      "PM Modi said India would manufacture everything from computer chips to ships, outlining its ambitions.",
      "He addressed the gathering during IIT Kharagpur's platinum jubilee celebrations, marking 75 years since establishment.",
      "Modi interacted with 75 students as part of the institute's '75 Voices for Viksit Bharat' initiative.",
      "He highlighted IIT Kharagpur's role in India's technological progress and its contribution to national development.",
    ],
    source: {
      label: "indiatvnews.com",
      url: "https://www.indiatvnews.com/west-bengal/news-pm-modi-addresses-iit-kharagpur-platinum-jubilee-celebration-here-s-what-he-said-2026-11-21-1059995",
    },
  },
  "spacex-hires-democratic-lobbyists-ahead-of-possible-us-congress-probes-20228": {
    points: [
      "SpaceX has hired five Washington lobbyists with Democratic ties ahead of a possible shift in Congress.",
      "The move comes as the company faces potential congressional scrutiny over its business and government ties.",
      "Lawmakers may examine SpaceX’s Starlink restrictions in Ukraine and the Pentagon’s reliance on its services.",
      "The company’s new hires include former aides to Al Gore and Senator Maria Cantwell.",
    ],
    source: {
      label: "businesstoday.in",
      url: "https://www.businesstoday.in/world/us/story/elon-musk-hires-democratic-lobbyists-as-spacex-braces-for-washington-scrutiny-report-568863-2026-11-21",
    },
  },
  "loud-music-phone-calls-on-trains-can-attract-rs-1-000-fine-or-6-month-jail-20224": {
    points: [
      "Eastern Railway has warned passengers against playing loud music, videos or making noisy phone calls on trains.",
      "Violators could face a fine of up to ₹1,000 or six months' imprisonment under the Railways Act, 1989.",
      "Ticket examiners can take action against passengers creating noise-related disturbances under Section 145.",
      "Passengers have been advised to use earphones and keep phones on silent or low volume during journeys.",
    ],
    source: {
      label: "ndtv.com",
      url: "https://www.ndtv.com/india-news/after-southern-railway-eastern-railway-warns-loud-calls-music-on-trains-could-land-you-in-jail-12357368",
    },
  },
  "telangana-to-go-ahead-with-december-global-summit-despite-water-and-power-20223": {
    points: [
      "Telangana government will go ahead with the Invest Telangana Global Summit 2026 from December 7 to 9.",
      "The summit will be held at Bharat Future City, with six exhibition hangars and 52 sector sessions.",
      "The three-day event will also feature nine special events, bringing together global investors and industry leaders.",
      "The government is pressing ahead despite calls to postpone the summit amid the State's water and power concerns.",
    ],
    source: {
      label: "telanganatoday.com",
      url: "https://telanganatoday.com/telangana-government-presses-ahead-with-global-summit-821d53ed",
    },
  },
  "parliaments-monsoon-session-remains-unprorogued-for-100-days-breaks-87-day-20221": {
    points: [
      "Parliament's Monsoon Session remained unprorogued for 100 days on Saturday, breaking the previous 87-day record.",
      "The government is considering a special sitting to pass a Bill implementing 33% women's reservation.",
      "The proposal seeks to increase Lok Sabha seats from 543 to 850 through delimitation ahead of the 2029 elections.",
      "Congress demanded an all-party meeting, questioning the delay and seeking clarity on how states' seat shares will change.",
    ],
    source: {
      label: "indiatoday.in",
      url: "https://www.indiatoday.in/india/story/parliament-monsoon-session-unprorogued-record-100-days-ptag-3043697-2026-11-21",
    },
  },
  "indian-refiners-scramble-to-secure-oil-tankers-as-shipping-costs-surge-20220": {
    points: [
      "Reliance, Indian Oil and other refiners are seeking long-term tanker contracts to secure crude supplies.",
      "Reliance has reportedly increased its supertanker fleet under long-term leases from 7–8 to around 12.",
      "Disruptions in the Persian Gulf have tightened tanker availability and pushed freight costs to record highs.",
      "India imports over 90% of its crude oil, making tanker shortages a major supply-chain risk.",
    ],
    source: {
      label: "economictimes.indiatimes.com",
      url: "https://economictimes.indiatimes.com/industry/energy/oil-gas/reliance-indian-oil-other-indian-refiners-race-to-secure-oil-tankers-as-freight-costs-rise/articleshow/136026329.cms",
    },
  },
  "we-promise-better-performance-byds-pitch-for-luxury-ev-brand-denza-20218": {
    points: [
      "BYD India’s EV head says its luxury brand Denza aims to challenge established European carmakers.",
      "The company promises better performance than European luxury brands as it pushes Denza in India.",
      "BYD is positioning Denza to compete in India's premium electric vehicle market.",
    ],
    source: {
      label: "firstpost.com",
      url: "https://www.firstpost.com/flaunt/cars-bikes/we-promise-better-performance-than-european-brands-byd-india-ev-head-on-denzas-luxury-push-14061579.html",
    },
  },
  "indias-first-bullet-train-to-begin-operations-in-2027-surat-vapi-section-to-20217": {
    points: [
      "Railway Minister Ashwini Vaishnaw said India's first bullet train will begin operations in the last quarter of 2027.",
      "The first service will run between Surat and Vapi, with the remaining Mumbai corridor opening in phases.",
      "Construction has covered 456 km of piers and 371 km of viaducts, while civil work is complete at eight stations.",
      "India's first undersea rail tunnel will span 7 km beneath Thane Creek, with two tunnel boring machines deployed.",
    ],
    source: {
      label: "moneycontrol.com",
      url: "https://www.moneycontrol.com/news/india/first-high-speed-rail-service-will-commence-in-last-quarter-of-2027-ashwini-vaishnaw-on-bullet-train-14086006.html",
    },
  },
  "ravi-kishan-to-star-in-film-exploring-korean-cultures-influence-on-india-20215": {
    points: [
      "Ravi Kishan will headline an untitled film exploring the growing influence of Korean culture on India.",
      "Directed by Bengali filmmakers Nandita Roy and Shiboprosad Mukherjee, the film is written by Zinia Sen.",
      "It will explore how Korean music, entertainment, fashion and lifestyle are shaping everyday Indian life.",
      "The makers describe it as a humorous entertainer exploring cultural ties between India and South Korea. The film is expected to go on floors in early 2027.",
    ],
    source: {
      label: "hollywoodreporterindia.com",
      url: "https://www.hollywoodreporterindia.com/features/insight/exclusive-ravi-kishan-to-headline-film-exploring-korean-cultures-influence-on-india",
    },
  },
  "up-cm-yogi-carries-mothers-mortal-remains-on-shoulder-during-last-rites-in-20214": {
    points: [
      "UP CM Yogi carried his mother Savitri Devi's mortal remains on his shoulder during Saturday's last rites.",
      "Savitri Devi died on Friday aged 91 at her ancestral village in Uttarakhand's Pauri Garhwal district.",
      "In a post on X, Yogi wrote, \"There is no shade like a mother's, no refuge like a mother's, no love like a mother's.\"",
      "PM Modi and Uttarakhand CM Pushkar Singh Dhami expressed condolences to Yogi and his family.",
    ],
    source: {
      label: "timesofindia.indiatimes.com",
      url: "https://timesofindia.indiatimes.com/india/up-cm-yogi-adityanath-bids-emotional-farewell-to-mother-carries-her-mortal-remains-in-uttarakhand/articleshow/136043844.cms",
    },
  },
  "indias-forex-reserves-fall-by-14-billion-to-three-month-low-of-705-billion-20213": {
    points: [
      "India's forex reserves fell by over $14 billion to $705.3 billion as of November 13, their lowest in three months.",
      "The decline was driven by a $7.8 billion drop in foreign currency assets and a $6.1 billion fall in gold holdings.",
      "Reserves stood at $719.5 billion the previous week, according to Reserve Bank of India data.",
      "The rupee weakened to 94.24 per dollar during the week before recovering to 92.67 on Friday.",
    ],
    source: {
      label: "reuters.com",
      url: "https://www.reuters.com/world/india/indias-forex-reserves-fall-over-three-month-low-705-billion-2026-11-20/",
    },
  },
  "india-bangladesh-ganga-treaty-renewal-faces-uncertainty-amid-strained-ties-20212": {
    points: [
      "India and Bangladesh face uncertainty over renewing the 1996 Ganga water-sharing treaty, which expires in December 2026.",
      "The agreement governs sharing Ganga waters at the Farakka Barrage, with Bangladesh receiving water during the dry season under an agreed formula.",
      "Strained bilateral ties could complicate renewal negotiations as both countries face growing water demands.",
      "The agreement is vital for agriculture, livelihoods and water management in both countries.",
    ],
    source: {
      label: "hindustantimes.com",
      url: "https://www.hindustantimes.com/india-news/india-bangladesh-risk-ganga-treaty-lapse-101795115726847.html",
    },
  },
  "us-report-says-china-backed-pakistan-during-operation-sindoor-to-suppress-20211": {
    points: [
      "A US congressional commission warned that China is using military and economic pressure to limit India's rise.",
      "Its November 18 report said China provided technical support to Pakistan during Operation Sindoor in May 2025.",
      "The report also flagged China's military buildup along India's border and restrictions on key industrial supplies.",
      "The commission urged stronger US-India intelligence sharing and defence cooperation to counter China's influence.",
    ],
    source: {
      label: "moneycontrol.com",
      url: "https://www.moneycontrol.com/news/india/china-trying-to-suppress-india-s-rise-backed-pakistan-during-operation-sindoor-us-report-14085939.html",
    },
  },
  "trump-urges-nvidia-to-reinstate-former-ceo-jensen-huang-says-he-deserves-a-20210": {
    points: [
      "US President Trump on Friday urged Nvidia to reinstate former CEO Jensen Huang during a White House briefing.",
      "Trump called Huang \"one of the truly most brilliant minds\" and said he deserved a second chance.",
      "Trump said Huang should make a public apology and urged Nvidia to bring him back as CEO.",
      "Huang resigned on November 12 following allegations of affairs, including one involving a suspected Chinese spy.",
    ],
    source: {
      label: "moneycontrol.com",
      url: "https://www.moneycontrol.com/world/a-good-man-who-trump-backs-jensen-huang-s-return-as-nvidia-ceo-article-14085920.html",
    },
  },
  "ladakh-to-hold-first-panchayat-municipal-polls-since-2019-voting-on-saturday-20209": {
    points: [
      "Ladakh will hold local elections on Saturday after eight years, the first since it became a Union Territory in 2019.",
      "Voting will run from 8 am to 5 pm across eight districts, with security and winter arrangements in place.",
      "Polling will cover 137 village head seats, 242 panch seats and municipal wards, with many elected unopposed.",
      "BJP, Congress and independents are contesting, while protests continue over the December 4 hill council polls.",
    ],
    source: {
      label: "newindianexpress.com",
      url: "https://www.newindianexpress.com/india/2026/Nov/21/first-panchayat-municipal-body-polls-in-ladakh-after-2019-today",
    },
  },
  "centre-meta-launch-instagram-microdrama-series-to-warn-indians-about-online-20208": {
    points: [
      "The Centre and Meta on Thursday announced a short drama series to raise awareness about online scams in India.",
      "The series will premiere on Instagram before streaming on Waves OTT as part of Meta's 'Scam Se Bacho' campaign.",
      "Episodes will highlight fake job offers, investment fraud and 'digital arrest' scams involving fake police officers.",
      "The campaign urges people to verify suspicious claims, report fraud and call the national cybercrime helpline 1930.",
    ],
    source: {
      label: "telegraphindia.com",
      url: "https://www.telegraphindia.com/india/centre-meta-launch-short-drama-series-on-online-scams-for-instagram-and-waves-ott/cid/2190300",
    },
  },
  "youth-congress-calls-meta-bjp-ka-beta-sets-7-day-deadline-to-restore-accounts-20207": {
    points: [
      "Youth Congress called Meta \"BJP ka Beta\" and gave it seven days to restore restricted accounts and posts.",
      "In a post on X, the group accused Meta of favouring the BJP by restricting Instagram accounts of its leaders.",
      "On Friday, Youth Congress workers entered Meta's Hyderabad office to protest, with around 20 protesters detained.",
      "Protests spread to Mumbai and Gurugram, while Youth Congress threatened further action if Meta ignored its demands.",
    ],
    source: {
      label: "moneycontrol.com",
      url: "https://www.moneycontrol.com/news/india/bjp-ka-beta-youth-congress-warns-meta-of-nationwide-protests-over-instagram-account-restrictions-14085955.html",
    },
  },
}
