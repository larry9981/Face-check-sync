
export const LANGUAGES = [
  { code: 'en', label: 'English', voiceCode: 'en-US' },
  { code: 'zh-CN', label: '简体中文 (Simplified)', voiceCode: 'zh-CN' },
  { code: 'zh-TW', label: '繁體中文 (Traditional)', voiceCode: 'zh-TW' },
  { code: 'ja', label: '日本語 (Japanese)', voiceCode: 'ja-JP' },
  { code: 'ko', label: '한국어 (Korean)', voiceCode: 'ko-KR' },
  { code: 'th', label: 'ไทย (Thai)', voiceCode: 'th-TH' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)', voiceCode: 'vi-VN' },
  { code: 'ms', label: 'Bahasa Melayu (Malay)', voiceCode: 'ms-MY' },
  { code: 'de', label: 'Deutsch (German)', voiceCode: 'de-DE' },
  { code: 'fr', label: 'Français (French)', voiceCode: 'fr-FR' },
  { code: 'es', label: 'Español (Spanish)', voiceCode: 'es-ES' },
  { code: 'pt', label: 'Português (Portuguese)', voiceCode: 'pt-PT' },
  { code: 'it', label: 'Italiano (Italian)', voiceCode: 'it-IT' },
];

export const TRANSLATIONS: any = {
  'en': {
    title: "Mystic Face", subtitle: "AI Fortune Teller", home: "Home", pricing: "Pricing", shop: "Shop", about: "About", privacy: "Privacy", terms: "Terms", history: "History",
    heroTitle: "Mystic Destiny", heroDesc: "Decode your destiny through the ancient wisdom of Physiognomy and Palmistry.",
    startBtn: "Face Reading", palmBtn: "Palm Reading", chooseMethod: "Profile & Method", scanBtn: "Scan Face", scanPalmBtn: "Scan Palm", uploadBtn: "Upload Photo", cancelBtn: "Cancel", backBtn: "Back",
    analyzeBtn: "Analyze Destiny", analyzingTitle: "Consulting the Spirits...", analyzingDesc: "Interpreting biometric data against ancient texts",
    resultTitle: "Destiny Analysis", readAloud: "Read", stop: "Stop", translating: "Translating...", analyzeAnother: "Analyze Another",
    howItWorks: "How It Works", step1Title: "1. Capture", step1Desc: "Upload an image of your face or palm.", step2Title: "2. Analysis", step2Desc: "Our AI maps your features to ancient charts.", step3Title: "3. Revelation", step3Desc: "Receive your comprehensive fortune report.",
    paywallTitle: "Tribute Required", paywallDesc: "Your 3-day free trial has expired.", paySingle: "Unlock 1 Reading", paySub: "See Plans",
    footerRight: "All rights reserved.", footerDisclaimer: "This site is for entertainment purposes only.",
    pricingTitle: "Choose Your Path", planSingle: "Single Destiny", planSinglePrice: "$1.99", planSingleDesc: "One detailed face reading report including wealth, career, and love analysis.",
    planOneMonth: "1 Month Pass", planOneMonthPrice: "$19.99", planOneMonthDesc: "One-time payment. 30 days of unlimited access. No auto-renewal.",
    planSubMonth: "Monthly Subscription", planSubMonthPrice: "$16.99", planSubMonthDesc: "Auto-renews monthly. Unlimited access. Cancel anytime.",
    planSubYear: "Yearly Subscription", planSubYearPrice: "$99.99", planSubYearDesc: "Best Value. Auto-renews yearly. Unlimited access all year round.",
    selectPlan: "Select Plan", paymentTitle: "Secure Payment", paymentMethod: "Payment Method", creditCard: "Credit Card", paypal: "PayPal",
    cardName: "Cardholder Name", cardNumber: "Card Number", expiry: "Expiry (MM/YY)", cvc: "CVC", payNow: "Pay Now", processing: "Processing...", success: "Payment Successful!", secureStripe: "Secured by Stripe",
    faceMapTitle: "Destiny Map", zoneForeheadTitle: "Career", zoneForeheadDesc: "Heaven Court", zoneParentsTitle: "Parents", zoneParentsDesc: "Inheritance",
    zoneBrowsTitle: "Siblings", zoneBrowsDesc: "Brotherhood", zoneEyesTitle: "Spirit", zoneEyesDesc: "Wisdom", zoneSpouseTitle: "Marriage", zoneSpouseDesc: "Love",
    zoneChildrenTitle: "Children", zoneChildrenDesc: "Legacy", zoneNoseTitle: "Wealth", zoneNoseDesc: "Money", zoneMouthTitle: "Speech", zoneMouthDesc: "Relations", zoneChinTitle: "Life", zoneChinDesc: "Stability",
    dobLabel: "Date of Birth", timeLabel: "Time of Birth", dateYear: "Year", dateMonth: "Month", dateDay: "Day", timeHour: "Hour", timeMinute: "Min", timeSecond: "Sec",
    ageLabel: "Age", profileTitle: "Subject Profile", genderLabel: "Gender", genderMale: "Male", genderFemale: "Female", genderOther: "Other", nameLabel: "Name (Optional)",
    combineAnalysis: "Combine Name & Birth Date Analysis",
    zodiacTitle: "Cosmic Alignment", chineseZodiac: "Chinese Zodiac", westernZodiac: "Star Sign", recommendedProducts: "Boost Your Fortune",
    buyNow: "Buy Now", addToCart: "Add to Cart", cart: "Cart", shopTitle: "Spiritual Treasures", shopDesc: "Artifacts to enhance your Qi and balance your Five Elements.",
    shopCategoryChinese: "Chinese Zodiac Collection", shopCategoryWestern: "Star Sign Collection", productDetails: "Artifact Specs", luckyElement: "Lucky Element Needed",
    zodiacRat: "Rat", zodiacOx: "Ox", zodiacTiger: "Tiger", zodiacRabbit: "Rabbit", zodiacDragon: "Dragon", zodiacSnake: "Snake", zodiacHorse: "Horse", zodiacGoat: "Goat", zodiacMonkey: "Monkey", zodiacRooster: "Rooster", zodiacDog: "Dog", zodiacPig: "Pig",
    starAries: "Aries", starTaurus: "Taurus", starGemini: "Gemini", starCancer: "Cancer", starLeo: "Leo", starVirgo: "Virgo", starLibra: "Libra", starScorpio: "Scorpio", starSagittarius: "Sagittarius", starCapricorn: "Capricorn", starAquarius: "Aquarius", starPisces: "Pisces",
    elementMetal: "Metal", elementWood: "Wood", elementWater: "Water", elementFire: "Fire", elementEarth: "Earth",
    productNameBracelet: "{zodiac} Fortune Bracelet", productNamePendant: "{zodiac} Jade Pendant", productNameAmulet: "Golden {zodiac} Amulet",
    productDescBracelet: "Handcrafted obsidian and gold bracelet engraved with the {zodiac} symbol. Enhances wealth, offers protection against negative energy, and stabilizes your Qi.",
    productDescPendant: "Authentic Hetian jade pendant featuring a meticulously carved {zodiac}. Known to promote health, harmony, and attract noble helpers in your life.",
    productDescAmulet: "Exquisite 18k gold amulet representing {zodiac}. Embedded with crystals to align with the stars and canalize cosmic energy for success.",
    freeTrialsHint: "Free trial active ({count} days remaining)", shippingDetails: "Shipping Address", addressLine: "Street Address", city: "City", zipCode: "Zip / Postal Code", country: "Country", recipientName: "Recipient Name",
    snapPhoto: "Take Photo", balanceBtn: "Balance Your Elements", balanceTitle: "Master Optimization Advice", yourWeakest: "Your Missing Element",
    luckyColors: "Lucky Colors", luckyDirection: "Lucky Direction", luckyHabit: "Habits to Adopt", recommendedCures: "Recommended Cures",
    namingAdvice: "Naming Advice", philosophy: "Life Philosophy",
    reportHeaderAura: "General Aura", reportHeaderElements: "Five Elements (Wu Xing)", reportHeaderName: "Name Analysis", reportHeaderStar: "Western Zodiac Analysis", reportHeaderFortune: "Temporal Fortune", reportHeaderWealth: "Wealth & Fortune", reportHeaderFamily: "Family & Relationships", reportHeaderParents: "Parents & Ancestors", reportHeaderAdvice: "Master's Advice",
    reportHeaderHealth: "Health Analysis", reportHeaderLove: "Emotional Analysis", reportHeaderDailyLuck: "Today's Luck",
    networkTimeout: "Network Timeout!", scanQRCode: "Please scan to pay",
    
    // Master Advice
    adviceCategoryDiet: "Dietary Advice",
    adviceCategoryHome: "Home Feng Shui",
    adviceCategoryJewelry: "Lucky Jewelry",
    adviceCategoryFiveElements: "Five Elements Advice",
    masterOptimizationBtn: "Master Optimization Advice",
    backToShop: "Back to Shop",

    adviceMetalColor: 'Gold, Silver, White', adviceMetalDirection: 'West', adviceMetalHabit: 'Organization, Structure', adviceMetalDesc: 'Your Metal energy is weak. You need structure and clarity.',
    adviceMetalName: 'Use names with sharp sounds (S, Z, X) or characters meaning Gold/Metal.', adviceMetalPhilosophy: '"True gold fears no fire." - Embrace hardship to refine your character.',
    adviceMetalDiet: 'Eat more white foods (pears, cauliflower, radish) and spicy flavors in moderation. Avoid too much bitter food.',
    adviceMetalHome: 'Place metal ornaments or wind chimes in the West sector of your home. Use white or metallic decor themes.',
    
    adviceWoodColor: 'Green, Cyan', adviceWoodDirection: 'East', adviceWoodHabit: 'Growth, Learning', adviceWoodDesc: 'Your Wood energy is weak. You need to cultivate growth and flexibility.',
    adviceWoodName: 'Use names with vowel sounds (A, E) or characters with Wood radicals.', adviceWoodPhilosophy: '"The tree that does not bend with the wind will break." - Practice flexibility.',
    adviceWoodDiet: 'Eat more green leafy vegetables and sour foods (lemons, green apples). Avoid excessive spicy food.',
    adviceWoodHome: 'Place healthy plants or wooden furniture in the East sector. Use green colors in your living space.',

    adviceWaterColor: 'Black, Blue', adviceWaterDirection: 'North', adviceWaterHabit: 'Reflection, Wisdom', adviceWaterDesc: 'Your Water energy is weak. Flow and adaptability are needed.',
    adviceWaterName: 'Use names with fluid sounds (L, M, W) or characters with Water radicals.', adviceWaterPhilosophy: '"Be like water." - Adapt to any container or situation.',
    adviceWaterDiet: 'Eat more black/dark foods (black beans, seaweed, black sesame) and salty flavors. Stay hydrated.',
    adviceWaterHome: 'Place a water feature (fountain, aquarium) or mirrors in the North sector. Use blue or black decor.',

    adviceFireColor: 'Red, Purple, Orange', adviceFireDirection: 'South', adviceFireHabit: 'Passion, Socializing', adviceFireDesc: 'Your Fire energy is weak. You lack warmth and drive.',
    adviceFireName: 'Use names with warm sounds (N, D, T) or characters with Fire radicals.', adviceFirePhilosophy: '"A single spark can start a prairie fire." - Small actions lead to great results.',
    adviceFireDiet: 'Eat more red foods (tomatoes, red peppers, red beans) and bitter flavors. Avoid cold/raw foods.',
    adviceFireHome: 'Ensure the South sector is well-lit. Use candles, lamps, or red decor accents to boost energy.',

    adviceEarthColor: 'Yellow, Brown, Beige', adviceEarthDirection: 'Center', adviceEarthHabit: 'Grounding, Stability', adviceEarthDesc: 'Your Earth energy is weak. You need stability and grounding.',
    adviceEarthName: 'Use names with deep sounds (G, K, U) or characters with Earth radicals.', adviceEarthPhilosophy: '"Great virtue carries all things." - Cultivate a broad and inclusive mind.',
    adviceEarthDiet: 'Eat more yellow/orange foods (pumpkin, corn, sweet potato) and sweet natural flavors.',
    adviceEarthHome: 'Place ceramics, crystals, or stones in the Northeast or Center of your home. Use earth tones.',

    historyTitle: "Past Readings", noHistory: "No history available.", viewResult: "View Result", dateLabel: "Date",
    cartTitle: "Your Shopping Cart", cartEmpty: "Your cart is empty.", total: "Total", checkout: "Checkout", remove: "Remove", quantity: "Qty",
    
    emailLabel: "Email Address", phoneLabel: "Phone Number", exportBtn: "Export Orders (Excel/WPS)", moreProducts: "Complete Collection",
    required: "Required", optional: "Optional",
    
    adminLogin: "Admin Login", adminDashboard: "Order Dashboard", username: "Username", password: "Password", login: "Login",
    orderId: "Order ID", customer: "Customer", items: "Items", amount: "Amount", status: "Status", date: "Date", address: "Address", noOrders: "No orders found.",
    
    aboutTitle: "About Mystic Face",
    aboutDesc1: "We combine the ancient art of Mianxiang (Chinese Face Reading) with modern Artificial Intelligence to provide insights into your destiny.",
    aboutDesc2: "Our system analyzes 108 facial landmarks to interpret your wealth, career, and relationship prospects based on centuries-old texts.",
    privacyTitle: "Privacy Policy",
    privacyIntro: "This privacy policy explains how Mystic Face (\"we\", \"us\", or \"our\") collects, uses, and discloses your information.",
    privacyCollectionTitle: "Information Collection",
    privacyCollectionDesc: "We do not store your face data. Images processed for face reading are analyzed in real-time and are not permanently saved on our servers.",
    privacyUsageTitle: "Usage",
    privacyUsageDesc: "We use the data solely to provide the fortune-telling service. Payment information is processed securely by third-party providers.",
    termsTitle: "Terms of Service",
    termsIntro: "By using Mystic Face, you agree to these terms.",
    termsDisclaimerTitle: "Disclaimer",
    termsDisclaimerDesc: "The advice given is simulated based on traditional physiognomy and should not replace professional medical, legal, or financial advice."
  },
  'zh-CN': {
    title: "玄机面相", subtitle: "AI 算命", home: "首页", pricing: "订阅", shop: "灵宝阁", about: "关于", privacy: "隐私", terms: "条款", history: "历史记录",
    heroTitle: "玄机天命", heroDesc: "透过古老智慧与现代科技，解码您的命运。",
    startBtn: "面相测试", palmBtn: "掌纹测试", chooseMethod: "个人信息与方式", scanBtn: "扫描面相", scanPalmBtn: "扫描手掌", uploadBtn: "上传照片", cancelBtn: "取消", backBtn: "返回",
    analyzeBtn: "开始算命", analyzingTitle: "沟通天地...", analyzingDesc: "正在推演周易卦象并进行面相分析",
    resultTitle: "命运批注", readAloud: "朗读", stop: "停止", translating: "翻译中...", analyzeAnother: "再测一次",
    howItWorks: "测试原理", step1Title: "1. 采集", step1Desc: "面部或手掌的生物特征扫描。", step2Title: "2. 推演", step2Desc: "将108个特征点与古籍进行比对。", step3Title: "3. 揭示", step3Desc: "获取您的财富、健康和情感运势。",
    paywallTitle: "需要贡金", paywallDesc: "您的3天免费试用期已结束。", paySingle: "解锁一次", paySub: "查看套餐",
    footerRight: "版权所有。", footerDisclaimer: "本网站仅供娱乐。",
    pricingTitle: "选择您的方案", planSingle: "单次算命", planSinglePrice: "$1.99", planSingleDesc: "一次详细的面相报告，包含财运、事业与姻缘分析。",
    planOneMonth: "单月畅享", planOneMonthPrice: "$19.99", planOneMonthDesc: "一次性支付。30天无限次算命。不自动续费。",
    planSubMonth: "连续包月", planSubMonthPrice: "$16.99", planSubMonthDesc: "每月自动续费。无限次算命。随时取消。",
    planSubYear: "年度会员", planSubYearPrice: "$99.99", planSubYearDesc: "超值优惠。每年自动续费。全年无限次畅享。",
    selectPlan: "选择方案", paymentTitle: "安全支付", paymentMethod: "支付方式", creditCard: "信用卡", paypal: "PayPal",
    cardName: "持卡人姓名", cardNumber: "卡号", expiry: "有效期 (MM/YY)", cvc: "安全码", payNow: "立即支付", processing: "支付处理中...", success: "支付成功！", secureStripe: "Stripe 安全支付",
    faceMapTitle: "面相十二宫", zoneForeheadTitle: "官禄宫", zoneForeheadDesc: "天庭饱满", zoneParentsTitle: "父母宮", zoneParentsDesc: "日月角",
    zoneBrowsTitle: "兄弟宮", zoneBrowsDesc: "眉毛浓淡", zoneEyesTitle: "田宅宮", zoneEyesDesc: "眼眸神采", zoneSpouseTitle: "夫妻宫", zoneSpouseDesc: "奸门",
    zoneChildrenTitle: "子女宫", zoneChildrenDesc: "泪堂", zoneNoseTitle: "财帛宫", zoneNoseDesc: "鼻准丰隆", zoneMouthTitle: "出纳官", zoneMouthDesc: "口唇", zoneChinTitle: "奴仆宫", zoneChinDesc: "地閣方圆",
    dobLabel: "出生日期", timeLabel: "出生时间", dateYear: "年", dateMonth: "月", dateDay: "日", timeHour: "时", timeMinute: "分", timeSecond: "秒",
    ageLabel: "年龄", profileTitle: "主体档案", genderLabel: "性别", genderMale: "男", genderFemale: "女", genderOther: "其他", nameLabel: "姓名 (测算姓名五行)",
    combineAnalysis: "结合名字和出生年月日分析",
    zodiacTitle: "命理乾坤", chineseZodiac: "生肖", westernZodiac: "星座", recommendedProducts: "开运好物推荐",
    buyNow: "立即购买", addToCart: "加入购物车", cart: "购物车", shopTitle: "灵宝阁", shopDesc: "精选法物，补全五行，增强气运。",
    shopCategoryChinese: "十二生肖系列", shopCategoryWestern: "十二星座系列", productDetails: "宝物详情", luckyElement: "五行喜用",
    zodiacRat: "鼠", zodiacOx: "牛", zodiacTiger: "虎", zodiacRabbit: "兔", zodiacDragon: "龙", zodiacSnake: "蛇", zodiacHorse: "马", zodiacGoat: "羊", zodiacMonkey: "猴", zodiacRooster: "鸡", zodiacDog: "狗", zodiacPig: "猪",
    starAries: "白羊座", starTaurus: "金牛座", starGemini: "双子座", starCancer: "巨蟹座", starLeo: "狮子座", starVirgo: "处女座", starLibra: "天秤座", starScorpio: "天蝎座", starSagittarius: "射手座", starCapricorn: "摩羯座", starAquarius: "水瓶座", starPisces: "双鱼座",
    elementMetal: "金", elementWood: "木", elementWater: "水", elementFire: "火", elementEarth: "土",
    productNameBracelet: "{zodiac} 开运黑曜石手串", productNamePendant: "{zodiac} 和田玉守护吊坠", productNameAmulet: "{zodiac} 黄金星象护身符",
    productDescBracelet: "手工串制黑曜石与足金配饰，刻有{zodiac}生肖图案。具有极强的辟邪化煞功效，稳固气场，招财进宝。",
    productDescPendant: "精选上等和田玉，雕刻栩栩如生的{zodiac}形象。长期佩戴可滋养身心，促进健康，遇贵人扶持。",
    productDescAmulet: "精美18k金{zodiac}护身符，镶嵌水晶，汇聚星辰之力，助您心想事成，诸事顺遂。",
    freeTrialsHint: "免费试用期 (剩余: {count}天)", shippingDetails: "收货地址", addressLine: "街道地址", city: "城市", zipCode: "邮编", country: "国家", recipientName: "收件人姓名",
    snapPhoto: "拍照", balanceBtn: "五行平衡调理", balanceTitle: "大师优化建议", yourWeakest: "您的喜用神 (最缺)",
    luckyColors: "幸运色", luckyDirection: "吉利方位", luckyHabit: "改运习惯", recommendedCures: "推荐补运法物",
    namingAdvice: "改名/起名建议", philosophy: "人生哲学",
    reportHeaderAura: "整体气场", reportHeaderElements: "五行分析", reportHeaderName: "姓名吉凶分析", reportHeaderStar: "星座运势分析", reportHeaderFortune: "流年流月运势", reportHeaderWealth: "财运与事业", reportHeaderFamily: "家庭与情感", reportHeaderParents: "父母与祖荫", reportHeaderAdvice: "大师建议",
    reportHeaderHealth: "健康分析", reportHeaderLove: "情感/姻缘分析", reportHeaderDailyLuck: "今日运势",
    networkTimeout: "网络超时！", scanQRCode: "请扫描二维码支付",
    
    // Master Advice
    masterOptimizationBtn: "大师优化建议",
    adviceCategoryDiet: "饮食建议",
    adviceCategoryHome: "家庭摆放建议",
    adviceCategoryJewelry: "开运首饰佩戴建议",
    adviceCategoryFiveElements: "五行建议",
    backToShop: "返回灵宝阁",

    adviceMetalColor: '金、银、白', adviceMetalDirection: '西方', adviceMetalHabit: '条理、规划', adviceMetalDesc: '您的五行缺金。需要增强决断力和条理性。',
    adviceMetalName: '建议名字中带有金字旁（钅）的字，如：锋、铭、钟、鑫。', adviceMetalPhilosophy: '“真金不怕火炼”，在磨砺中成就自我。',
    adviceMetalDiet: '多吃白色食物（梨、花菜、白萝卜）和适量辛辣口味。避免过多苦味。',
    adviceMetalHome: '在家中西方摆放金属饰品或风铃。使用白色或金属色调的装饰。',

    adviceWoodColor: '绿、青', adviceWoodDirection: '东方', adviceWoodHabit: '学习、养植', adviceWoodDesc: '您的五行缺木。需要培养仁爱之心和生发之气。',
    adviceWoodName: '建议名字中带有木字旁（木）或草字头（艹）的字，如：林、森、藝、苏。', adviceWoodPhilosophy: '“木秀于林，风必摧之”，但根深方能叶茂。',
    adviceWoodDiet: '多吃绿色蔬菜和酸味食物（柠檬、青苹果）。避免过量辛辣。',
    adviceWoodHome: '在东方摆放生机勃勃的植物或木质家具。使用绿色调。',

    adviceWaterColor: '黑、蓝', adviceWaterDirection: '北方', adviceWaterHabit: '思考、智慧', adviceWaterDesc: '您的五行缺水。需要增强智慧和适应能力，如水般流动。',
    adviceWaterName: '建议名字中带有三点水（氵）的字，如：沐、清、海、洋。', adviceWaterPhilosophy: '“上善若水”，利万物而不争，适应万变。',
    adviceWaterDiet: '多吃黑色/深色食物（黑豆、海带、黑芝麻）和咸味。注意补水。',
    adviceWaterHome: '在北方摆放水景（鱼缸、流水摆件）或镜子。使用蓝色或黑色装饰。',

    adviceFireColor: '红、紫、橙', adviceFireDirection: '南方', adviceFireHabit: '社交、热情', adviceFireDesc: '您的五行缺火。需要增强热情和行动力，如火般温暖。',
    adviceFireName: '建议名字中带有火字旁（火）或日字旁的字，如：炎、煜、旭、明。', adviceFirePhilosophy: '“星星之火，可以燎原”，保持内心的热情。',
    adviceFireDiet: '多吃红色食物（番茄、红椒、红豆）和苦味。避免生冷食物。',
    adviceFireHome: '保持南方明亮。使用蜡烛、灯具或红色装饰来增强能量。',

    adviceEarthColor: '黄、棕、褐', adviceEarthDirection: '中宫', adviceEarthHabit: '静坐、诚信', adviceEarthDesc: '您的五行缺土。需要增强稳重感和包容心，如大地般厚重。',
    adviceEarthName: '建议名字中带有土字旁（土）或山字旁的字，如：坤、磊、崇、峰。', adviceEarthPhilosophy: '“厚德载物”，以宽广的胸怀包容一切。',
    adviceEarthDiet: '多吃黄色/橙色食物（南瓜、玉米、红薯）和自然甜味。',
    adviceEarthHome: '在家中东北方或中央位置摆放陶瓷、水晶或石材。使用大地色系。',

    historyTitle: "历史记录", noHistory: "暂无历史记录", viewResult: "查看结果", dateLabel: "日期",
    cartTitle: "您的购物车", cartEmpty: "购物车是空的。", total: "总计", checkout: "去结账", remove: "移除", quantity: "数量",

    emailLabel: "邮箱地址", phoneLabel: "联系电话", exportBtn: "导出订单 (Excel/WPS)", moreProducts: "更多精选",
    required: "必填", optional: "选填",
    
    adminLogin: "管理员登录", adminDashboard: "订单管理后台", username: "用户名", password: "密码", login: "登录",
    orderId: "订单号", customer: "客户", items: "商品", amount: "金额", status: "状态", date: "日期", address: "地址", noOrders: "暂无订单数据。",

    aboutTitle: "关于玄机面相",
    aboutDesc1: "我们将古老的面相学（Mianxiang）与现代人工智能相结合，为您解读命运。",
    aboutDesc2: "我们的系统分析108个面部特征点，依据百年古籍解读您的财富、事业和情感前景。",
    privacyTitle: "隐私政策",
    privacyIntro: "本隐私政策说明了玄机面相（“我们”）如何收集、使用和披露您的信息。",
    privacyCollectionTitle: "信息收集",
    privacyCollectionDesc: "我们不会存储您的面部数据。用于面相分析的图像是实时处理的，不会永久保存在我们的服务器上。",
    privacyUsageTitle: "使用",
    privacyUsageDesc: "我们仅将数据用于提供算命服务。支付信息由第三方提供商安全处理。",
    termsTitle: "服务条款",
    termsIntro: "使用玄机面相即表示您同意这些条款。",
    termsDisclaimerTitle: "免责声明",
    termsDisclaimerDesc: "建议基于传统面相学模拟，不应取代专业的医疗、法律或财务建议。"
  },
  'zh-TW': {
     title: "玄機面相", subtitle: "AI 算命", home: "首頁", pricing: "訂閱", shop: "靈寶閣", about: "關於", privacy: "隱私", terms: "條款", history: "歷史記錄",
    heroTitle: "玄機天命", heroDesc: "透過古老智慧與現代科技，解碼您的命運。",
    startBtn: "面相測試", palmBtn: "掌紋測試", chooseMethod: "個人信息與方式", scanBtn: "掃描面相", scanPalmBtn: "掃描手掌", uploadBtn: "上傳照片", cancelBtn: "取消", backBtn: "返回",
    analyzeBtn: "開始算命", analyzingTitle: "溝通天地...", analyzingDesc: "正在推演周易卦象並進行面相分析",
    resultTitle: "命運批註", readAloud: "朗讀", stop: "停止", translating: "翻譯中...", analyzeAnother: "再測一次",
    howItWorks: "測試原理", step1Title: "1. 採集", step1Desc: "面部或手掌的生物特徵掃描。", step2Title: "2. 推演", step2Desc: "將108個特徵點與古籍進行比對。", step3Title: "3. 揭示", step3Desc: "獲取您的財富、健康和情感運勢。",
    paywallTitle: "需要貢金", paywallDesc: "您的3天免費試用期已結束。", paySingle: "解鎖一次", paySub: "查看套餐",
    footerRight: "版權所有。", footerDisclaimer: "本網站僅供娛樂。",
    pricingTitle: "選擇您的方案", planSingle: "單次算命", planSinglePrice: "$1.99", planSingleDesc: "一次詳細的面相報告，包含財運、事業與姻緣分析。",
    planOneMonth: "單月暢享", planOneMonthPrice: "$19.99", planOneMonthDesc: "一次性支付。30天無限次算命。不自動續費。",
    planSubMonth: "連續包月", planSubMonthPrice: "$16.99", planSubMonthDesc: "每月自動續費。無限次算命。隨時取消。",
    planSubYear: "年度會員", planSubYearPrice: "$99.99", planSubYearDesc: "超值優惠。每年自動續費。全年無限次暢享。",
    selectPlan: "選擇方案", paymentTitle: "安全支付", paymentMethod: "支付方式", creditCard: "信用卡", paypal: "PayPal",
    cardName: "持卡人姓名", cardNumber: "卡號", expiry: "有效期 (MM/YY)", cvc: "安全碼", payNow: "立即支付", processing: "支付處理中...", success: "支付成功！", secureStripe: "Stripe 安全支付",
    faceMapTitle: "面相十二宮", zoneForeheadTitle: "官祿宮", zoneForeheadDesc: "天庭飽滿", zoneParentsTitle: "父母宮", zoneParentsDesc: "日月角",
    zoneBrowsTitle: "兄弟宮", zoneBrowsDesc: "眉毛濃淡", zoneEyesTitle: "田宅宮", zoneEyesDesc: "眼眸神采", zoneSpouseTitle: "夫妻宮", zoneSpouseDesc: "奸門",
    zoneChildrenTitle: "子女宮", zoneChildrenDesc: "淚堂", zoneNoseTitle: "財帛宮", zoneNoseDesc: "鼻準豐隆", zoneMouthTitle: "出納官", zoneMouthDesc: "口唇", zoneChinTitle: "奴仆宮", zoneChinDesc: "地閣方圓",
    dobLabel: "出生日期", timeLabel: "出生時間", dateYear: "年", dateMonth: "月", dateDay: "日", timeHour: "時", timeMinute: "分", timeSecond: "秒",
    ageLabel: "年齡", profileTitle: "主體檔案", genderLabel: "性別", genderMale: "男", genderFemale: "女", genderOther: "其他", nameLabel: "姓名 (測算姓名五行)",
    combineAnalysis: "結合名字和出生年月日分析",
    zodiacTitle: "命理乾坤", chineseZodiac: "生肖", westernZodiac: "星座", recommendedProducts: "開運好物推薦",
    buyNow: "立即購買", addToCart: "加入購物車", cart: "購物車", shopTitle: "靈寶閣", shopDesc: "精選法物，補全五行，增強氣運。",
    shopCategoryChinese: "十二生肖系列", shopCategoryWestern: "十二星座系列", productDetails: "寶物詳情", luckyElement: "五行喜用",
    zodiacRat: "鼠", zodiacOx: "牛", zodiacTiger: "虎", zodiacRabbit: "兔", zodiacDragon: "龍", zodiacSnake: "蛇", zodiacHorse: "馬", zodiacGoat: "羊", zodiacMonkey: "猴", zodiacRooster: "雞", zodiacDog: "狗", zodiacPig: "豬",
    starAries: "白羊座", starTaurus: "金牛座", starGemini: "雙子座", starCancer: "巨蟹座", starLeo: "獅子座", starVirgo: "處女座", starLibra: "天秤座", starScorpio: "天蠍座", starSagittarius: "射手座", starCapricorn: "摩羯座", starAquarius: "水瓶座", starPisces: "雙魚座",
    elementMetal: "金", elementWood: "木", elementWater: "水", elementFire: "火", elementEarth: "土",
    productNameBracelet: "{zodiac} 開運黑曜石手串", productNamePendant: "{zodiac} 和田玉守護吊墜", productNameAmulet: "{zodiac} 黃金星象護身符",
    productDescBracelet: "手工串製黑曜石與足金配飾，刻有{zodiac}生肖圖案。具有極強的辟邪化煞功效，穩固氣場，招財進寶。",
    productDescPendant: "精選上等和田玉，雕刻栩栩如生的{zodiac}形象。長期佩戴可滋養身心，促進健康，遇貴人扶持。",
    productDescAmulet: "精美18k金{zodiac}護身符，鑲嵌水晶，匯聚星辰之力，助您心想事成，諸事順遂。",
    freeTrialsHint: "免費試用期 (剩餘: {count}天)", shippingDetails: "收貨地址", addressLine: "街道地址", city: "城市", zipCode: "郵編", country: "國家", recipientName: "收件人姓名",
    snapPhoto: "拍照", balanceBtn: "五行平衡調理", balanceTitle: "大師優化建議", yourWeakest: "您的喜用神 (最缺)",
    luckyColors: "幸運色", luckyDirection: "吉利方位", luckyHabit: "改運習慣", recommendedCures: "推薦補運法物",
    namingAdvice: "改名/起名建議", philosophy: "人生哲學",
    reportHeaderAura: "整體氣場", reportHeaderElements: "五行分析", reportHeaderName: "姓名吉凶分析", reportHeaderStar: "星座運勢分析", reportHeaderFortune: "流年流月運勢", reportHeaderWealth: "財運與事業", reportHeaderFamily: "家庭與情感", reportHeaderParents: "父母與祖荫", reportHeaderAdvice: "大師建議",
    reportHeaderHealth: "健康分析", reportHeaderLove: "情感/姻緣分析", reportHeaderDailyLuck: "今日運勢",
    networkTimeout: "網絡超時！", scanQRCode: "請掃描二維碼支付",
    
    // Master Advice
    masterOptimizationBtn: "大師優化建議",
    adviceCategoryDiet: "飲食建議",
    adviceCategoryHome: "家庭擺放建議",
    adviceCategoryJewelry: "開運首飾佩戴建議",
    adviceCategoryFiveElements: "五行建議",
    backToShop: "返回靈寶閣",

    adviceMetalColor: '金、銀、白', adviceMetalDirection: '西方', adviceMetalHabit: '條理、規劃', adviceMetalDesc: '您的五行缺金。需要增強決斷力和條理性。',
    adviceMetalName: '建議名字中帶有金字旁（金）的字，如：鋒、銘、鐘、鑫。', adviceMetalPhilosophy: '“真金不怕火煉”，在磨礪中成就自我。',
    adviceMetalDiet: '多吃白色食物（梨、花菜、白蘿蔔）和適量辛辣口味。避免過多苦味。',
    adviceMetalHome: '在家中西方擺放金屬飾品或風鈴。使用白色或金屬色調的裝飾。',

    adviceWoodColor: '綠、青', adviceWoodDirection: '東方', adviceWoodHabit: '學習、養植', adviceWoodDesc: '您的五行缺木。需要培養仁愛之心和生發之氣。',
    adviceWoodName: '建議名字中帶有木字旁（木）或草字頭（艹）的字，如：林、森、藝、蘇。', adviceWoodPhilosophy: '“木秀於林，風必摧之”，但根深方能葉茂。',
    adviceWoodDiet: '多吃綠色蔬菜和酸味食物（檸檬、青蘋果）。避免過量辛辣。',
    adviceWoodHome: '在東方擺放生機勃勃的植物或木質家具。使用綠色調。',

    adviceWaterColor: '黑、藍', adviceWaterDirection: '北方', adviceWaterHabit: '思考、智慧', adviceWaterDesc: '您的五行缺水。需要增強智慧和適應能力，如水般流動。',
    adviceWaterName: '建議名字中帶有三點水（氵）的字，如：沐、清、海、洋。', adviceWaterPhilosophy: '“上善若水”，利万物而不爭，適應萬變。',
    adviceWaterDiet: '多吃黑色/深色食物（黑豆、海帶、黑芝麻）和鹹味。注意補水。',
    adviceWaterHome: '在北方擺放水景（魚缸、流水擺件）或鏡子。使用藍色或黑色裝飾。',

    adviceFireColor: '紅、紫、橙', adviceFireDirection: '南方', adviceFireHabit: '社交、熱情', adviceFireDesc: '您的五行缺火。需要增強熱情和行動力，如火般溫暖。',
    adviceFireName: '建議名字中帶有火字旁（火）或日字旁的字，如：炎、煜、旭、明。', adviceFirePhilosophy: '“星星之火，可以燎原”，保持內心的熱情。',
    adviceFireDiet: '多吃紅色食物（番茄、紅椒、紅豆）和苦味。避免生冷食物。',
    adviceFireHome: '保持南方明亮。使用蠟燭、燈具或紅色裝飾來增強能量。',

    adviceEarthColor: '黃、棕、褐', adviceEarthDirection: '中宮', adviceEarthHabit: '靜坐、誠信', adviceEarthDesc: '您的五行缺土。需要增強穩重感和包容心，如大地般厚重。',
    adviceEarthName: '建議名字中帶有土字旁（土）或山字旁的字，如：坤、磊、崇、峰。', adviceEarthPhilosophy: '“厚德載物”，以寬廣的胸懷包容一切。',
    adviceEarthDiet: '多吃黃色/橙色食物（南瓜、玉米、紅薯）和自然甜味。',
    adviceEarthHome: '在家中東北方或中央位置擺放陶瓷、水晶或石材。使用大地色系。',

    historyTitle: "歷史記錄", noHistory: "暫無歷史記錄", viewResult: "查看結果", dateLabel: "日期",
    cartTitle: "您的購物車", cartEmpty: "購物車是空的。", total: "總計", checkout: "去結賬", remove: "移除", quantity: "數量",

    emailLabel: "郵箱地址", phoneLabel: "聯繫電話", exportBtn: "導出訂單 (Excel/WPS)", moreProducts: "更多精選",
    required: "必填", optional: "選填",
    
    adminLogin: "管理員登錄", adminDashboard: "訂單管理後台", username: "用戶名", password: "密碼", login: "登錄",
    orderId: "訂單號", customer: "客戶", items: "商品", amount: "金額", status: "狀態", date: "日期", address: "地址", noOrders: "暫無訂單數據。",

    aboutTitle: "關於玄機面相",
    aboutDesc1: "我們將古老的面相學（Mianxiang）與現代人工智能相結合，為您解讀命運。",
    aboutDesc2: "我們的系統分析108個面部特徵點，依據百年古籍解讀您的財富、事業和情感前景。",
    privacyTitle: "隱私政策",
    privacyIntro: "本隱私政策說明了玄機面相（“我們”）如何收集、使用和披露您的信息。",
    privacyCollectionTitle: "信息收集",
    privacyCollectionDesc: "我們不會存儲您的面部數據。用於面相分析的圖像係實時處理，不會永久保存在我們的服務器上。",
    privacyUsageTitle: "使用",
    privacyUsageDesc: "我們僅將數據用於提供算命服務。支付信息由第三方提供商安全處理。",
    termsTitle: "服務條款",
    termsIntro: "使用玄機面相即表示您同意這些條款。",
    termsDisclaimerTitle: "免責聲明",
    termsDisclaimerDesc: "建議基於傳統面相學模擬，不應取代專業的醫療、法律或財務建議。"
  }
};

// Add fallback translations for other languages to ensure they have the new keys
const otherLangs = ['ja', 'ko', 'th', 'vi', 'ms', 'de', 'fr', 'es', 'pt', 'it'];
otherLangs.forEach(lang => {
    // Clone English as base
    TRANSLATIONS[lang] = { ...TRANSLATIONS['en'] };
    
    // Customize specific labels where possible (simplified)
    if (lang === 'ja') {
        TRANSLATIONS[lang].title = "人相占い";
        TRANSLATIONS[lang].heroTitle = "運命の解読";
        TRANSLATIONS[lang].startBtn = "人相占い";
        TRANSLATIONS[lang].palmBtn = "手相占い";
    } else if (lang === 'ko') {
        TRANSLATIONS[lang].title = "관상";
        TRANSLATIONS[lang].heroTitle = "운명의 해석";
        TRANSLATIONS[lang].startBtn = "관상 보기";
        TRANSLATIONS[lang].palmBtn = "손금 보기";
    } else if (lang === 'th') {
        TRANSLATIONS[lang].title = "โหงวเฮ้ง";
        TRANSLATIONS[lang].heroTitle = "โชคชะตา";
        TRANSLATIONS[lang].startBtn = "อ่านใบหน้า";
        TRANSLATIONS[lang].palmBtn = "อ่านลายมือ";
    } else if (lang === 'vi') {
        TRANSLATIONS[lang].title = "Tướng Số";
        TRANSLATIONS[lang].heroTitle = "Giải Mã Vận Mệnh";
        TRANSLATIONS[lang].startBtn = "Xem Tướng Mặt";
        TRANSLATIONS[lang].palmBtn = "Xem Chỉ Tay";
    }
});
