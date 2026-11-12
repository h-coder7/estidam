export type Localized = { ar: string; en: string };

export type AssessmentOptionKey = "A" | "B" | "C" | "D";

export type AssessmentQuestionContent = {
    no: number;
    text: Localized;
    options: { key: AssessmentOptionKey; label: Localized }[];
};

export type AssessmentStageContent = {
    stage: number;
    key: string;
    name: Localized;
    questions: AssessmentQuestionContent[];
};

const option = (key: AssessmentOptionKey, ar: string, en: string) => ({ key, label: { ar, en } });

export const assessmentQuestions: AssessmentStageContent[] = [
    {
        stage: 1,
        key: "profile",
        name: { ar: "ملف المنشأة والنشاط", en: "Organization Profile" },
        questions: [
            {
                no: 1,
                text: {
                    ar: "ما هو حجم المنشأة والكوادر الموسمية أثناء فترة التشغيل أو الذروة؟",
                    en: "What is the size of your organization and seasonal staff during operations or peak season?",
                },
                options: [
                    option("A", "1 – 50 موظفًا (فريق عمل صغير/إداري).", "1 – 50 employees (small/administrative team)."),
                    option("B", "51 – 200 موظفًا ميدانيًا وقياديًا.", "51 – 200 field and leadership staff."),
                    option("C", "201 – 500 يشمل الكوادر الميدانية والإدارية.", "201 – 500 including field and administrative staff."),
                    option("D", "أكثر من 500 موظف وموسمي (تشغيل واسع النطاق - Enterprise).", "More than 500 permanent and seasonal staff (Enterprise-scale operations)."),
                ],
            },
            {
                no: 2,
                text: {
                    ar: "ما هو المجال التشغيلي الرئيسي الذي تركز عليه المنشأة؟",
                    en: "What is the main operational domain your organization focuses on?",
                },
                options: [
                    option("A", "تقديم خدمات الحج والعمرة وإدارة مخيمات وسكن ضيوف الرحمن.", "Hajj & Umrah services and managing pilgrim camps and accommodation."),
                    option("B", "الإشراف الميداني، اللوجستيات، وحركة الحافلات/التغذية.", "Field supervision, logistics, and bus/catering movement."),
                    option("C", "إدارة وتوفير العمالة والكوادر البشرية الموسمية (Workforce & HR).", "Managing and supplying seasonal workforce (Workforce & HR)."),
                    option("D", "خدمات استشارية وتقنية عامة لقطاع الأعمال.", "General consulting and technology services for businesses."),
                ],
            },
            {
                no: 3,
                text: {
                    ar: "ما هو النطاق الجغرافي وطبيعة انتشار عملياتكم الميدانية؟",
                    en: "What is the geographic scope and spread of your field operations?",
                },
                options: [
                    option("A", "موقع ثابت واحد (مقر إداري رئيسي).", "A single fixed site (main head office)."),
                    option("B", "عدة مواقع ثابتة داخل مدينة واحدة.", "Several fixed sites within one city."),
                    option("C", "مواقع ميدانية موسمية متوزعة (المشاعر المقدسة، مكة، المدينة، المنافذ).", "Distributed seasonal field sites (Holy Sites, Makkah, Madinah, entry ports)."),
                    option("D", "شبكة واسعة من المرافق والمخيمات والمسارات الميدانية في مختلف المناطق.", "A wide network of facilities, camps and field routes across regions."),
                ],
            },
        ],
    },
    {
        stage: 2,
        key: "operations",
        name: { ar: "العمليات والتشغيل الميداني", en: "Operations & Field Management" },
        questions: [
            {
                no: 4,
                text: {
                    ar: "كيف تتم إدارة وتوجيه الإجراءات والبلاغات الميدانية أثناء التشغيل؟",
                    en: "How are field procedures and incident reports managed and routed during operations?",
                },
                options: [
                    option("A", "عبر الاتصالات الهاتفية وتطبيقات التواصل مثل الواتساب بشكل يدوي غير موثق.", "Via phone calls and messaging apps like WhatsApp, manually and undocumented."),
                    option("B", "توجد نماذج ورقية أو قوائم تفقدية يتم تفريغها لاحقًا في نهاية اليوم.", "Paper forms or checklists that are transcribed at the end of the day."),
                    option("C", "نستخدم نظامًا آليًا لاستلام البلاغات وتوجيه الفرقة الميدانية الأقرب.", "An automated system receives reports and dispatches the nearest field team."),
                    option("D", "لدينا منصة مراقبة موحدة (Command Center) لإدارة العمليات الميدانية والتوجيه الآلي لحظيًا.", "A unified Command Center platform manages field operations with real-time automated dispatch."),
                ],
            },
            {
                no: 5,
                text: {
                    ar: "ما مدى حجم المهام المكررة والإدخال اليدوي في متابعة الخدمات للضيوف؟",
                    en: "How much repetitive work and manual data entry is involved in tracking guest services?",
                },
                options: [
                    option("A", "عالية جدًا (نقل البيانات يدويًا بين جداول Excel والتطبيقات الورقية يستغرق معظم الوقت).", "Very high (manually moving data between Excel and paper takes most of the time)."),
                    option("B", "متوسطة (بعض الأجزاء مؤتمتة، ولكن تتطلب إدخالًا يدويًا كبيرًا في فترة الذروة).", "Medium (some parts automated, but heavy manual entry at peak)."),
                    option("C", "منخفضة (أغلب المسارات مؤتمتة، والتركيز على متابعة الاستثناءات والحالات الطارئة).", "Low (most flows automated; focus is on exceptions and emergencies)."),
                    option("D", "معدومة تقريبًا (العمليات تدفق آلي بالكامل من الرصد إلى التوثيق).", "Almost none (fully automated flow from detection to documentation)."),
                ],
            },
            {
                no: 6,
                text: {
                    ar: "كيف يتم التعامل مع حالات التأخير أو انخفاض مستوى جودة الخدمة (SLA Violations)؟",
                    en: "How are delays or drops in service quality (SLA violations) handled?",
                },
                options: [
                    option("A", "نكتشف المشكلة بعد انتهاء الموسم أو بعد تلقي شكوى رسمية من العميل/المستفيد.", "We find out after the season ends or after a formal complaint."),
                    option("B", "نكتشف التأخير من خلال مراجعة تقارير المشرفين في نهاية كل وردية.", "We spot delays by reviewing supervisor reports at the end of each shift."),
                    option("C", "تصلنا تنبيهات عند تأخر معالجة البلاغ لتصعيده للمشرف المباشر.", "We get alerts when a report is delayed, escalated to the direct supervisor."),
                    option("D", "يعتمد النظام على تحليلات تنبؤية للتحذير قبل وقوع الخلل الميداني أو التأخير في الخدمة.", "Predictive analytics warn us before a field failure or service delay happens."),
                ],
            },
        ],
    },
    {
        stage: 3,
        key: "workforce",
        name: { ar: "إدارة الكوادر والعمالة الموسمية", en: "Seasonal Workforce & HR" },
        questions: [
            {
                no: 7,
                text: {
                    ar: "كيف تتم عمليات توظيف وتوزيع الكوادر والعمالة الموسمية قبل وأثناء الموسم؟",
                    en: "How is seasonal staff recruited and deployed before and during the season?",
                },
                options: [
                    option("A", "التسجيل عبر ملفات ورقية أو إيميلات وتوزيع يدوي حسب الحاجة اليومية.", "Registration via paper files or emails, with manual daily allocation."),
                    option("B", "التقديم عبر نماذج إلكترونية (Forms)، لكن معالجة المقابلات والتوزيع تتم يدويًا.", "Online forms, but interviews and allocation are handled manually."),
                    option("C", "توجد منصة لإدارة التوظيف الموسمي وإسناد المهام للموظفين حسب التخصص.", "A platform manages seasonal hiring and assigns tasks by specialty."),
                    option("D", "نظام ذكي كامل يتولى المطابقة الآلية بين مهارات الكادر والاحتياج الميداني مع التسكين والتوجيه الآلي.", "A smart system auto-matches staff skills to field needs with automated placement."),
                ],
            },
            {
                no: 8,
                text: {
                    ar: "كيف تتابعون حضور وانتشار وأداء الكوادر الميدانية في أوقات الذروة؟",
                    en: "How do you track attendance, deployment and performance of field staff at peak times?",
                },
                options: [
                    option("A", "الاعتماد على التحضير الورقي أو كشوفات الحضور الإدارية التقليدية.", "Paper roll-calls or traditional attendance sheets."),
                    option("B", "متابعة عشوائية عبر رؤساء المجموعات والرسائل النصية.", "Ad-hoc follow-up through group leaders and text messages."),
                    option("C", "استخدام البصمة الإلكترونية أو تسجيل الدخول عبر تطبيق الجوال بحسب الموقع الجغرافي (GPS).", "Biometric or GPS-based mobile app check-in."),
                    option("D", "تتبع لحظي ذكي للانتشار الميداني وكثافة التغطية ومعدل إنجاز المهام لكل فرد/فريق.", "Smart real-time tracking of deployment, coverage density and task completion per person/team."),
                ],
            },
        ],
    },
    {
        stage: 4,
        key: "data",
        name: { ar: "البيانات والتقارير الميدانية", en: "Data & Decision Intelligence" },
        questions: [
            {
                no: 9,
                text: {
                    ar: "أين وكيف تُحفظ بيانات الخدمات والملاحظات الميدانية وسجلات الحجاج/العملاء؟",
                    en: "Where and how are service data, field notes and pilgrim/customer records stored?",
                },
                options: [
                    option("A", "بيانات مبعثرة في ملفات Excel شخصية، إيميلات، ومجموعات واتساب.", "Scattered across personal Excel files, emails and WhatsApp groups."),
                    option("B", "مخزنة في قواعد بيانات أو أنظمة متعددة ولكن لا يوجد ربط أو توحيد بينها.", "Stored in multiple databases or systems with no integration."),
                    option("C", "مخزنة في قاعدة بيانات مركزية معتمدة لكل قطاعات المنشأة.", "Stored in an approved central database for all departments."),
                    option("D", "مخزنة في مستودع بيانات موحد (Data Warehouse) منظم ومحدث لحظيًا للتحليل المتقدم.", "Stored in a unified, real-time Data Warehouse ready for advanced analytics."),
                ],
            },
            {
                no: 10,
                text: {
                    ar: "ما هي طبيعة التقارير التشغيلية التي تعتمد عليها القيادة أثناء الموسم؟",
                    en: "What kind of operational reports does leadership rely on during the season?",
                },
                options: [
                    option("A", "تقارير يدوية وتلخيصية تصدر بعد انتهاء الموسم بأيام/أسابيع.", "Manual summary reports issued days/weeks after the season."),
                    option("B", "تقارير يومية تُعد نهاية اليوم وتعتمد على تجميع البيانات الميدانية يدويًا.", "Daily end-of-day reports compiled manually from field data."),
                    option("C", "لوحات تحكم تفاعلية (Dashboards) تعرض مؤشرات الأداء الحالية (Live Performance).", "Interactive dashboards showing live performance indicators."),
                    option("D", "لوحات تحكم ذكية تنبؤية توصي بالإجراء المطلوب وتتوقع الاختناقات قبل حدوثها.", "Smart predictive dashboards that recommend actions and forecast bottlenecks."),
                ],
            },
        ],
    },
    {
        stage: 5,
        key: "infrastructure",
        name: { ar: "البنية التحتية والتكامل", en: "Systems & AI Governance" },
        questions: [
            {
                no: 11,
                text: {
                    ar: "ما مدى قابلية أنظمتكم الحالية للربط والتكامل (APIs) مع أدوات الذكاء الاصطناعي؟",
                    en: "How ready are your current systems to integrate (APIs) with AI tools?",
                },
                options: [
                    option("A", "نعتمد على برامج مغلقة أو أنظمة قديمة لا تدعم الربط مطلقًا.", "Closed or legacy systems with no integration support."),
                    option("B", "تدعم الربط ولكن يتطلب ذلك تكلفة عالية وتطويرًا مخصصًا معقدًا.", "Integration is possible but costly and needs complex custom work."),
                    option("C", "الأنظمة الحالية بها واجهات برمجية (APIs) جاهزة لبعض المكونات الأساسية.", "Current systems have ready APIs for some core components."),
                    option("D", "بنية سحابية مرنة بالكامل (Cloud-Native) ومجهزة بـ APIs للربط الفوري مع نماذج الـ AI.", "Fully cloud-native architecture with APIs for instant AI integration."),
                ],
            },
            {
                no: 12,
                text: {
                    ar: "ما هو مدى الالتزام بالحوكمة وحماية البيانات الشخصية والأمن السيبراني؟",
                    en: "How committed is your organization to governance, personal data protection and cybersecurity?",
                },
                options: [
                    option("A", "لا توجد سياسات محددة مكتوبة لحوكمة أو حماية البيانات.", "No written data governance or protection policies."),
                    option("B", "نطبق تعليمات أمن معلومات عامة دون وجود أطر خاصة بالذكاء الاصطناعي.", "General information-security rules, no AI-specific frameworks."),
                    option("C", "نلتزم بمتطلبات الأمن السيبراني وحماية البيانات الشخصية وفق التشريعات الوطنية (NDMO / SDAIA).", "We comply with national cybersecurity and data protection rules (NDMO / SDAIA)."),
                    option("D", "لدينا إطار حوكمة صارم للبيانات، مع سياسات واضحة لاستخدام الذكاء الاصطناعي الأخلاقي المعتمد.", "A strict data governance framework with clear policies for ethical AI use."),
                ],
            },
        ],
    },
    {
        stage: 6,
        key: "goals",
        name: { ar: "التحديات والأهداف الاستراتيجية", en: "Challenges & Goals" },
        questions: [
            {
                no: 13,
                text: {
                    ar: "ما هو التحدي الأكبر الذي تواجهه المنشأة في تشغيلها الميداني أو الإداري؟",
                    en: "What is the biggest challenge in your field or administrative operations?",
                },
                options: [
                    option("A", "بطء الإجراءات وتأخر معالجة البلاغات والطلبات بسبب كثرة الخطوات اليدوية.", "Slow procedures and delayed handling of reports due to many manual steps."),
                    option("B", "صعوبة متابعة انتشار الموظفين والفرق الميدانية في التغطية المكانية.", "Difficulty tracking staff and field team coverage."),
                    option("C", "صعوبة إدارة وتدريب وتوزيع العمالة الموسمية الشاسعة في وقت قياسي.", "Managing, training and deploying a large seasonal workforce in record time."),
                    option("D", "غياب الرؤية اللحظية وشح البيانات الدقيقة المتاحة لمتخذي القرار أثناء فترة الذروة.", "No real-time visibility and little accurate data for decision-makers at peak."),
                ],
            },
            {
                no: 14,
                text: {
                    ar: "ما هي النتيجة الأكثر أهمية التي ترغب المنشأة في تحقيقها عبر الذكاء الاصطناعي؟",
                    en: "What is the most important outcome you want to achieve with AI?",
                },
                options: [
                    option("A", "أتمتة الإجراءات المكررة وتقليل الاعتماد على العنصر البشري في إدخال البيانات.", "Automate repetitive procedures and reduce manual data entry."),
                    option("B", "رفع سرعة وجودة الاستجابة الميدانية وضمان الالتزام بمستويات الخدمة (SLAs).", "Faster, better field response and guaranteed SLA compliance."),
                    option("C", "الاستفادة من البيانات التنبؤية لتفادي الأزمات وتوزيع الموارد التشغيلية بذكاء.", "Use predictive data to avoid crises and allocate resources smartly."),
                    option("D", "بناء مساعد ذكي تنفيذي ومعرفي يدعم صناع القرار والمشرفين لحظة بلحظة.", "Build an executive AI assistant that supports leaders and supervisors in real time."),
                ],
            },
        ],
    },
];

export const assessmentCopy = (value: Localized, locale: string) => (locale === "ar" ? value.ar : value.en);
