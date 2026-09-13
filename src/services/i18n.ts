export type Language = 'uz' | 'ru' | 'en';
export type ThemeMode = 'dark' | 'light' | 'midnight';

export interface Translations {
  // Navigation tabs
  tab_overview: string;
  tab_forecast: string;
  tab_regions: string;
  tab_map: string;
  tab_scenario: string;
  tab_methodology: string;

  // Header & Global
  app_subtitle: string;
  synthetic_badge: string;
  nodes_online: string;
  current_time_label: string;
  forecast_24h_label: string;
  active_alerts: string;
  refresh_data: string;
  data_refreshed: string;
  quick_region_select: string;
  all_regions: string;
  export_report: string;
  language_toggle: string;

  // Theme
  theme_label: string;
  theme_dark: string;
  theme_light: string;
  theme_midnight: string;

  // Trust Banner
  prototype_notice: string;
  prototype_disclaimer: string;
  data_provenance: string;
  hide_details: string;
  methodology_link: string;
  banner_point1_title: string;
  banner_point1_desc: string;
  banner_point2_title: string;
  banner_point2_desc: string;
  banner_point3_title: string;
  banner_point3_desc: string;

  // KPI Overview
  kpi_total_forecast: string;
  kpi_current_load: string;
  kpi_peak_window: string;
  kpi_stressed_nodes: string;
  kpi_confidence: string;
  vs_baseline: string;
  linepack_utilization: string;
  pressure_adequate: string;
  critical_nodes: string;
  nominal_state: string;
  historical_mape: string;

  // Units
  mcm_day: string;
  mcm_hour: string;
  gcal_hour: string;
  celsius: string;
  percent: string;
  bar: string;

  // Filters and Buttons
  filter_all: string;
  filter_critical: string;
  filter_elevated: string;
  filter_optimal: string;
  sort_by: string;
  sort_demand: string;
  sort_utilization: string;
  sort_temp: string;
  sort_name: string;
  search_placeholder: string;
  btn_forecast: string;
  btn_map: string;
  btn_details: string;
  btn_simulate: string;
  btn_inspect: string;
  btn_acknowledge_all: string;
  btn_acknowledge: string;
  btn_reset: string;
  btn_download_csv: string;
  btn_copy_summary: string;
  btn_close: string;
  view_grid: string;
  view_table: string;

  // Forecast View
  forecast_horizon_24h: string;
  forecast_horizon_7d: string;
  forecast_decomposition: string;
  temp_overlay: string;
  confidence_bands: string;
  unit_toggle: string;
  forecast_chart_title: string;
  forecast_chart_subtitle: string;
  model_r2: string;
  model_rmse: string;
  peak_hour: string;

  // Map View
  map_metric_demand: string;
  map_metric_utilization: string;
  map_metric_temperature: string;
  layer_pipelines: string;
  layer_compressor_stations: string;
  layer_labels: string;
  map_reset_view: string;
  map_zoom_in: string;
  map_zoom_out: string;
  map_fit: string;
  selected_geographic_node: string;
  baseline_demand: string;
  feeder_loops: string;

  // Scenario Simulator
  sim_title: string;
  sim_subtitle: string;
  preset_cold_snap: string;
  preset_industrial_surge: string;
  preset_pipeline_constraint: string;
  preset_summer_drop: string;
  slider_temp_delta: string;
  slider_seasonal: string;
  slider_industrial: string;
  slider_population: string;
  slider_capacity_constraint: string;
  sim_results_title: string;
  sim_mitigation_title: string;
  sim_export_btn: string;

  // Executive Report Modal
  report_modal_title: string;
  report_modal_subtitle: string;
  report_national_summary: string;
  report_critical_zones: string;
  report_action_checklist: string;
  report_copied: string;
}

export const RUSSIAN_REGION_NAMES: Record<string, string> = {
  'uz-tk-city': 'г. Ташкент',
  'uz-tk-reg': 'Ташкентская область',
  'uz-sa': 'Самаркандская область',
  'uz-fa': 'Ферганская область',
  'uz-an': 'Андижанская область',
  'uz-ng': 'Наманганская область',
  'uz-bu': 'Бухарская область',
  'uz-qa': 'Кашкадарьинская область',
  'uz-su': 'Сурхандарьинская область',
  'uz-ji': 'Джизакская область',
  'uz-si': 'Сырдарьинская область',
  'uz-nw': 'Навоийская область',
  'uz-kh': 'Хорезмская область',
  'uz-qr': 'Республика Каракалпакстан',
};

export const TRANSLATIONS: Record<Language, Translations> = {
  uz: {
    // Navigation tabs
    tab_overview: "Bosh sahifa (Umumiy)",
    tab_forecast: "Talab prognozi",
    tab_regions: "Hududiy tahlil",
    tab_map: "Interaktiv xarita",
    tab_scenario: "Ssenariy simulyatori",
    tab_methodology: "Metodologiya",

    // Header & Global
    app_subtitle: "O'zbekiston tabiiy gaz taqsimoti va talabini prognozlash intellektual tizimi",
    synthetic_badge: "Sintetik demo ma'lumotlar",
    nodes_online: "12/12 Tugunlar aloqada",
    current_time_label: "Toshkent vaqti",
    forecast_24h_label: "24s Prognoz",
    active_alerts: "Ogohlantirishlar",
    refresh_data: "Yangilash",
    data_refreshed: "Telemetriya ma'lumotlari muvaffaqiyatli yangilandi",
    quick_region_select: "Tezkor hudud tanlash",
    all_regions: "Respublika (Barcha 12 hudud)",
    export_report: "Hisobot",
    language_toggle: "Til",

    // Theme
    theme_label: "Mavzu",
    theme_dark: "Tizimli (Dark)",
    theme_light: "Yorug' (Light)",
    theme_midnight: "Tungi (Midnight)",

    // Trust Banner
    prototype_notice: "Prototip haqida eslatma:",
    prototype_disclaimer: "Tizim ilmiy kalibrlangan sintetik ma'lumotlarda ishlaydi. Real magistral gaz quvurlari va avtomatlashtirilgan kranlarni bevosita boshqarish uchun mo'ljallanmagan.",
    data_provenance: "Ma'lumotlar manbasi",
    hide_details: "Yashirish",
    methodology_link: "Metodologiya va arxitektura",
    banner_point1_title: "1. Sintetik modellashtirish",
    banner_point1_desc: "Iste'mol hajmlari O'zbekistonning iqlimiy isitish daraja-kunlari (HDD), aholi soni va sanoat indekslari asosida matematik tarzda hisoblanadi.",
    banner_point2_title: "2. Qaror qabul qilishni qo'llab-quvvatlash",
    banner_point2_desc: "Tizim faqat rejalashtiruvchi muhandislar uchun tahliliy va prognoz ko'rsatkichlarni taqdim etadi.",
    banner_point3_title: "3. SCADA integratsiyasi istiqboli",
    banner_point3_desc: "Kelajakda Uztransgaz va Hududgazta'minot ning tijorat hisoblagichlari hamda gaz xromatograflari telemetriyasi bilan integratsiyalash mumkin.",

    // KPI Overview
    kpi_total_forecast: "KUTILAYOTGAN JAMI TALAB",
    kpi_current_load: "JORIY ISTE'MOL YUKLAMASI",
    kpi_peak_window: "ENG TIG'IZ VAQT ORALIG'I",
    kpi_stressed_nodes: "YUQORI YUKLAMALI HUDUDLAR",
    kpi_confidence: "MODEL ISHONCHLILIGI",
    vs_baseline: "24s bazaviy ko'rsatkichga nisbatan",
    linepack_utilization: "Laynpek (quvur zaxirasi) yuklamasi",
    pressure_adequate: "Barcha magistrallarda bosim barqaror",
    critical_nodes: "Kritik yuklama ostidagi hududlar",
    nominal_state: "Barcha hududlar nominal oraliqda",
    historical_mape: "Tarixiy test MAPE xatoligi",

    // Units
    mcm_day: "mln m³/kun",
    mcm_hour: "mln m³/soat",
    gcal_hour: "Gkal/soat ekv.",
    celsius: "°C",
    percent: "%",
    bar: "bar",

    // Filters and Buttons
    filter_all: "Barchasi",
    filter_critical: "Kritik yuklama",
    filter_elevated: "Yuqori yuklama",
    filter_optimal: "Optimal / Barqaror",
    sort_by: "Saralash:",
    sort_demand: "Iste'mol hajmi bo'yicha",
    sort_utilization: "Yuklama foizi bo'yicha",
    sort_temp: "Harorat bo'yicha",
    sort_name: "Alifbo bo'yicha (A-Z)",
    search_placeholder: "Hudud yoki tumanni qidirish (masalan: Samarqand, Chilonzor, Buxoro)...",
    btn_forecast: "Soatlik prognoz",
    btn_map: "Xaritada ko'rish",
    btn_details: "Batafsil",
    btn_simulate: "Ssenariyda sinash",
    btn_inspect: "Tahlil qilish",
    btn_acknowledge_all: "Barchasini tasdiqlash",
    btn_acknowledge: "Tasdiqlash",
    btn_reset: "Tiklash",
    btn_download_csv: "CSV yuklab olish",
    btn_copy_summary: "Xulosadan nusxa olish",
    btn_close: "Yopish",
    view_grid: "Kartalar",
    view_table: "Jadval",

    // Forecast View
    forecast_horizon_24h: "24 Soatlik (Soatbay)",
    forecast_horizon_7d: "7 Kunlik (Haftalik)",
    forecast_decomposition: "Omillar tahlili",
    temp_overlay: "Harorat chizig'i",
    confidence_bands: "95% Ishonchlilik oralig'i",
    unit_toggle: "O'lchov birligi:",
    forecast_chart_title: "Tabiiy gaz talabi dinamikasi va kutilayotgan prognoz",
    forecast_chart_subtitle: "Isitish daraja-kunlari (HDD) va aholi faolligi hisobga olingan ko'rsatkichlar",
    model_r2: "Model determinatsiyasi (R²)",
    model_rmse: "O'rtacha kvadratik xato (RMSE)",
    peak_hour: "Maksimal talab soati",

    // Map View
    map_metric_demand: "Talab hajmi (mln m³/kun)",
    map_metric_utilization: "Quvur yuklamasi (%)",
    map_metric_temperature: "Havoning harorati (°C)",
    layer_pipelines: "Magistral gaz quvurlari",
    layer_compressor_stations: "Kompressor stansiyalari va UGS",
    layer_labels: "Hudud belgilari",
    map_reset_view: "Xaritani tiklash",
    map_zoom_in: "Kattalashtirish (+)",
    map_zoom_out: "Kichiklashtirish (-)",
    map_fit: "O'rtaga joylash",
    selected_geographic_node: "Tanlangan geografik tugun",
    baseline_demand: "Bazaviy iste'mol",
    feeder_loops: "Taqsimlash tarmoqlari",

    // Scenario Simulator
    sim_title: "Gaz ta'minoti va quvurlar yuklamasi ssenariylari simulyatori",
    sim_subtitle: "Ekstremal ob-havo, sanoat yuklamasi va quvur cheklovlarini matematik tahlil qilish",
    preset_cold_snap: "❄️ Arktika sovuq to'lqini (-10°C)",
    preset_industrial_surge: "🏭 Sanoat yuklamasi oshishi (+25%)",
    preset_pipeline_constraint: "⚠️ Magistral ta'mirlash (-20% quvvat)",
    preset_summer_drop: "☀️ Yozgi mavsumiy pasayish (-15%)",
    slider_temp_delta: "Harorat siljishi (ΔT)",
    slider_seasonal: "Mavsumiylik koeffitsiyenti",
    slider_industrial: "Sanoat korxonalari yuki",
    slider_population: "Aholi va xonadonlar talabi",
    slider_capacity_constraint: "Magistral quvvatini cheklash",
    sim_results_title: "Simulyatsiya qilingan ko'rsatkichlar va solishtirish",
    sim_mitigation_title: "Tavsiya etilayotgan operativ chora-tadbirlar",
    sim_export_btn: "Ssenariy hisobotini yuklab olish",

    // Executive Report Modal
    report_modal_title: "Dispetcherlik va Rejalashtirish Boshqaruv Hisoboti",
    report_modal_subtitle: "O'zbekiston tabiiy gaz taqsimot tizimining 24 soatlik tahliliy xulosasi",
    report_national_summary: "Respublika bo'yicha umumiy holat",
    report_critical_zones: "Yuqori yuklamali va defitsit xavfi mavjud hududlar",
    report_action_checklist: "Tavsiya etilgan dispetcherlik ko'rsatmalari",
    report_copied: "Hisobot matni buferga nusxalandi!",
  },
  ru: {
    // Navigation tabs
    tab_overview: "Сводка (Главная)",
    tab_forecast: "Прогноз спроса",
    tab_regions: "Регионы",
    tab_map: "Интерактивная карта",
    tab_scenario: "Симулятор сценариев",
    tab_methodology: "Методология",

    // Header & Global
    app_subtitle: "Интеллектуальная система прогнозирования и балансировки спроса на природный газ в Узбекистане",
    synthetic_badge: "Синтетические данные",
    nodes_online: "12/12 Узлов на связи",
    current_time_label: "Ташкентское время",
    forecast_24h_label: "Прогноз 24ч",
    active_alerts: "Предупреждения",
    refresh_data: "Обновить",
    data_refreshed: "Данные телеметрии успешно обновлены",
    quick_region_select: "Выбор региона",
    all_regions: "Республика (Все 12 регионов)",
    export_report: "Отчет",
    language_toggle: "Язык",

    // Theme
    theme_label: "Тема",
    theme_dark: "Диспетчер (Dark)",
    theme_light: "Светлая (Light)",
    theme_midnight: "Полночь (OLED)",

    // Trust Banner
    prototype_notice: "Примечание прототипа:",
    prototype_disclaimer: "Система работает на научно откалиброванных синтетических данных. Не предназначена для прямого управления реальной запорной арматурой магистралей.",
    data_provenance: "Источники данных",
    hide_details: "Скрыть",
    methodology_link: "Методология и архитектура",
    banner_point1_title: "1. Синтетическое моделирование",
    banner_point1_desc: "Объемы потребления рассчитываются математически на основе градусо-дней отопления (HDD), численности населения и промышленной активности.",
    banner_point2_title: "2. Поддержка принятия решений",
    banner_point2_desc: "Система предоставляет диспетчерам и инженерам прогнозные балансы спроса и точки гидравлических перегрузок.",
    banner_point3_title: "3. Готовность к SCADA",
    banner_point3_desc: "Архитектура готова к интеграции с телеметрией коммерческих узлов учета и хроматографов «Узтрансгаз» и «Худудгазтаъминот».",

    // KPI Overview
    kpi_total_forecast: "ОЖИДАЕМЫЙ СОВОКУПНЫЙ СПРОС",
    kpi_current_load: "ТЕКУЩАЯ ОЦЕНКА НАГРУЗКИ",
    kpi_peak_window: "ПИКОВЫЙ ИНТЕРВАЛ СУТОК",
    kpi_stressed_nodes: "ЗОНЫ ВЫСОКОЙ НАГРУЗКИ",
    kpi_confidence: "ДОСТОВЕРНОСТЬ МОДЕЛИ",
    vs_baseline: "по сравнению с базовым 24ч",
    linepack_utilization: "Использование буферного газа (лайнпек)",
    pressure_adequate: "Давление в магистралях стабильно во всех ветках",
    critical_nodes: "Регионы под критической нагрузкой",
    nominal_state: "Все узлы находятся в номинальных пределах",
    historical_mape: "Историческая ошибка теста MAPE",

    // Units
    mcm_day: "млн м³/сут",
    mcm_hour: "млн м³/ч",
    gcal_hour: "Гкал/ч экв.",
    celsius: "°C",
    percent: "%",
    bar: "бар",

    // Filters and Buttons
    filter_all: "Все регионы",
    filter_critical: "Критическая",
    filter_elevated: "Повышенная",
    filter_optimal: "Оптимально",
    sort_by: "Сортировка:",
    sort_demand: "По объему спроса",
    sort_utilization: "По загрузке сетей (%)",
    sort_temp: "По температуре",
    sort_name: "По алфавиту (А-Я)",
    search_placeholder: "Поиск региона или района (напр., Самарканд, Чиланзар, Бухара)...",
    btn_forecast: "Часовой прогноз",
    btn_map: "На карту",
    btn_details: "Подробнее",
    btn_simulate: "В симулятор",
    btn_inspect: "Анализировать",
    btn_acknowledge_all: "Подтвердить все",
    btn_acknowledge: "Подтвердить",
    btn_reset: "Сбросить",
    btn_download_csv: "Экспорт CSV",
    btn_copy_summary: "Скопировать резюме",
    btn_close: "Закрыть",
    view_grid: "Плитка",
    view_table: "Таблица",

    // Forecast View
    forecast_horizon_24h: "24 Часа (Почасовой)",
    forecast_horizon_7d: "7 Дней (Суточный)",
    forecast_decomposition: "Факторный анализ",
    temp_overlay: "График температуры",
    confidence_bands: "95% Доверительный интервал",
    unit_toggle: "Единица измерения:",
    forecast_chart_title: "Динамика и прогноз потребления природного газа",
    forecast_chart_subtitle: "С учетом температурного фактора (HDD) и суточных биоритмов потребителей",
    model_r2: "Коэффициент детерминации (R²)",
    model_rmse: "Среднеквадратичная ошибка (RMSE)",
    peak_hour: "Интервал пикового разбора",

    // Map View
    map_metric_demand: "Прогноз спроса (млн м³/сут)",
    map_metric_utilization: "Загрузка газопроводов (%)",
    map_metric_temperature: "Температура воздуха (°C)",
    layer_pipelines: "Магистральные газопроводы",
    layer_compressor_stations: "Компрессорные станции и ПХГ",
    layer_labels: "Подписи и значения",
    map_reset_view: "Сброс вида",
    map_zoom_in: "Увеличить (+)",
    map_zoom_out: "Уменьшить (-)",
    map_fit: "Центрировать карту",
    selected_geographic_node: "Выбранный географический узел",
    baseline_demand: "Базовый спрос",
    feeder_loops: "Распределительные кольца",

    // Scenario Simulator
    sim_title: "Симулятор стресс-сценариев спроса и пропускной способности",
    sim_subtitle: "Моделирование аномальных заморозков, промышленного пика и аварийных ограничений",
    preset_cold_snap: "❄️ Арктическое похолодание (-10°C)",
    preset_industrial_surge: "🏭 Промышленный рост (+25%)",
    preset_pipeline_constraint: "⚠️ Ремонт магистрали (-20% мощн.)",
    preset_summer_drop: "☀️ Летний минимум (-15%)",
    slider_temp_delta: "Сдвиг температуры (ΔT)",
    slider_seasonal: "Сезонный коэффициент",
    slider_industrial: "Нагрузка промышленности",
    slider_population: "Потребление домохозяйств",
    slider_capacity_constraint: "Ограничение мощности труб",
    sim_results_title: "Сравнение: Базовый спрос vs Смоделированный сценарий",
    sim_mitigation_title: "Рекомендуемые диспетчерские противоаварийные меры",
    sim_export_btn: "Скачать отчет сценария",

    // Executive Report Modal
    report_modal_title: "Диспетчерский и аналитический сводный отчет",
    report_modal_subtitle: "24-часовая аналитическая сводка распределения газа в Узбекистане",
    report_national_summary: "Состояние по Республике",
    report_critical_zones: "Зоны повышенной нагрузки и риска дефицита",
    report_action_checklist: "Рекомендуемые оперативные директивы",
    report_copied: "Текст отчета скопирован в буфер обмена!",
  },
  en: {
    // Navigation tabs
    tab_overview: "Overview",
    tab_forecast: "Demand Forecast",
    tab_regions: "Regional Intelligence",
    tab_map: "Interactive Map",
    tab_scenario: "Scenario Simulator",
    tab_methodology: "Data & Methodology",

    // Header & Global
    app_subtitle: "Uzbekistan Gas Demand Forecasting & Distribution Intelligence",
    synthetic_badge: "Synthetic Demo Data",
    nodes_online: "12/12 Nodes Online",
    current_time_label: "Tashkent Time",
    forecast_24h_label: "24h Forecast",
    active_alerts: "Alerts",
    refresh_data: "Refresh",
    data_refreshed: "SCADA telemetry data successfully refreshed",
    quick_region_select: "Quick Region Select",
    all_regions: "National Aggregate (All 12 Regions)",
    export_report: "Report",
    language_toggle: "Language",

    // Theme
    theme_label: "Theme",
    theme_dark: "Dark (Slate)",
    theme_light: "Light (Clean)",
    theme_midnight: "Midnight (OLED)",

    // Trust Banner
    prototype_notice: "Prototype Notice:",
    prototype_disclaimer: "Prototype using synthetic demonstration data. Not connected to live gas infrastructure and not intended for direct operational control.",
    data_provenance: "Data Provenance",
    hide_details: "Hide Details",
    methodology_link: "Methodology & Architecture",
    banner_point1_title: "1. Synthetic Modeling",
    banner_point1_desc: "Regional consumption values are modeled mathematically using Heating Degree Days (HDD), demographic indices, and industrial intensity.",
    banner_point2_title: "2. Decision Support Only",
    banner_point2_desc: "This system forecasts demand variations and highlights capacity pinch points for planning engineers. It does NOT command valves.",
    banner_point3_title: "3. Future SCADA Ingestion",
    banner_point3_desc: "Full production deployment is ready for live custody transfer meter telemetries, gas chromatographs, and pressure sensors.",

    // KPI Overview
    kpi_total_forecast: "TOTAL FORECAST DEMAND",
    kpi_current_load: "CURRENT ESTIMATED LOAD",
    kpi_peak_window: "PROJECTED PEAK WINDOW",
    kpi_stressed_nodes: "HIGH-DEMAND ZONES",
    kpi_confidence: "MODEL CONFIDENCE",
    vs_baseline: "vs 24h baseline",
    linepack_utilization: "Linepack utilization",
    pressure_adequate: "Pipeline pressure stable across all trunks",
    critical_nodes: "Nodes under critical linepack strain",
    nominal_state: "All regional nodes within nominal limits",
    historical_mape: "Historical test set MAPE",

    // Units
    mcm_day: "mcm/d",
    mcm_hour: "mcm/h",
    gcal_hour: "Gcal/h eq.",
    celsius: "°C",
    percent: "%",
    bar: "bar",

    // Filters and Buttons
    filter_all: "All",
    filter_critical: "Critical Peak",
    filter_elevated: "Elevated Load",
    filter_optimal: "Optimal / Stable",
    sort_by: "Sort By:",
    sort_demand: "By Demand Volume",
    sort_utilization: "By Utilization %",
    sort_temp: "By Temperature",
    sort_name: "Alphabetical (A-Z)",
    search_placeholder: "Search region or district (e.g., Samarkand, Chilanzar, Bukhara)...",
    btn_forecast: "Hourly Forecast",
    btn_map: "Locate on Map",
    btn_details: "Details",
    btn_simulate: "Test in Simulator",
    btn_inspect: "Inspect",
    btn_acknowledge_all: "Acknowledge All",
    btn_acknowledge: "Acknowledge",
    btn_reset: "Reset",
    btn_download_csv: "Download CSV",
    btn_copy_summary: "Copy Summary",
    btn_close: "Close",
    view_grid: "Cards",
    view_table: "Table",

    // Forecast View
    forecast_horizon_24h: "24 Hours (Hourly)",
    forecast_horizon_7d: "7 Days (Daily)",
    forecast_decomposition: "Decomposition",
    temp_overlay: "Temperature Overlay",
    confidence_bands: "95% Confidence Band",
    unit_toggle: "Display Unit:",
    forecast_chart_title: "Natural Gas Demand Time-Series and Forecast",
    forecast_chart_subtitle: "Incorporating Heating Degree Days (HDD) and diurnal human routines",
    model_r2: "Model Coefficient of Determination (R²)",
    model_rmse: "Root Mean Square Error (RMSE)",
    peak_hour: "Peak Demand Window",

    // Map View
    map_metric_demand: "Forecast Demand (mcm/d)",
    map_metric_utilization: "Pipeline Utilization (%)",
    map_metric_temperature: "Ambient Temp (°C)",
    layer_pipelines: "Trunk Pipelines",
    layer_compressor_stations: "Compressor Hubs & UGS",
    layer_labels: "Labels & Values",
    map_reset_view: "Reset View",
    map_zoom_in: "Zoom In (+)",
    map_zoom_out: "Zoom Out (-)",
    map_fit: "Center Map",
    selected_geographic_node: "Selected Geographic Node",
    baseline_demand: "Baseline Demand",
    feeder_loops: "Distribution Feeder Loops",

    // Scenario Simulator
    sim_title: "Gas Demand & Infrastructure Capacity Scenario Simulator",
    sim_subtitle: "Simulate extreme weather anomalies, industrial load shifts, and pipeline capacity constraints",
    preset_cold_snap: "❄️ Arctic Cold Snap (-10°C)",
    preset_industrial_surge: "🏭 Industrial Surge (+25%)",
    preset_pipeline_constraint: "⚠️ Trunk Maintenance (-20% Cap)",
    preset_summer_drop: "☀️ Summer Shoulder (-15%)",
    slider_temp_delta: "Temp Shift (ΔT)",
    slider_seasonal: "Seasonal Factor",
    slider_industrial: "Industrial Load",
    slider_population: "Household Demand",
    slider_capacity_constraint: "Trunk Derating",
    sim_results_title: "Regional Demand: Baseline vs Scenario Simulation",
    sim_mitigation_title: "Recommended Operational Mitigations",
    sim_export_btn: "Download Simulation Report",

    // Executive Report Modal
    report_modal_title: "Executive Gas Dispatch & Planning Briefing",
    report_modal_subtitle: "24-Hour Regional Distribution Intelligence Summary for Uzbekistan",
    report_national_summary: "National Aggregate Status",
    report_critical_zones: "High-Load & Constrained Distribution Zones",
    report_action_checklist: "Recommended Operational Protocol",
    report_copied: "Executive report copied to clipboard!",
  }
};

export function getLocalizedRegionName(
  region: { id?: string; name: string; uzbekName?: string; russianName?: string } | null | undefined, 
  lang: Language
): string {
  if (!region) return '';
  if (lang === 'uz') return region.uzbekName || region.name;
  if (lang === 'ru') {
    if (region.russianName) return region.russianName;
    if (region.id && RUSSIAN_REGION_NAMES[region.id]) return RUSSIAN_REGION_NAMES[region.id];
    return region.name;
  }
  return region.name;
}
