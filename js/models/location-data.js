(function(app) {
  'use strict';

  var LocationData = {};

  LocationData.TZ_LOCATION_KEYS = [
    'Europe/Andorra',
    'Asia/Dubai',
    'Asia/Kabul',
    'America/Antigua',
    'America/Anguilla',
    'Europe/Tirane',
    'Asia/Yerevan',
    'Africa/Luanda',
    'Antarctica/McMurdo',
    'Antarctica/Rothera',
    'Antarctica/Palmer',
    'Antarctica/Mawson',
    'Antarctica/Davis',
    'Antarctica/Casey',
    'Antarctica/Vostok',
    'Antarctica/DumontDUrville',
    'Antarctica/Syowa',
    'America/Argentina/Buenos_Aires',
    'America/Argentina/Cordoba',
    'America/Argentina/Salta',
    'America/Argentina/Jujuy',
    'America/Argentina/Tucuman',
    'America/Argentina/Catamarca',
    'America/Argentina/La_Rioja',
    'America/Argentina/San_Juan',
    'America/Argentina/Mendoza',
    'America/Argentina/San_Luis',
    'America/Argentina/Rio_Gallegos',
    'America/Argentina/Ushuaia',
    'Pacific/Pago_Pago',
    'Europe/Vienna',
    'Australia/Lord_Howe',
    'Antarctica/Macquarie',
    'Australia/Hobart',
    'Australia/Currie',
    'Australia/Melbourne',
    'Australia/Sydney',
    'Australia/Broken_Hill',
    'Australia/Brisbane',
    'Australia/Lindeman',
    'Australia/Adelaide',
    'Australia/Darwin',
    'Australia/Perth',
    'Australia/Eucla',
    'America/Aruba',
    'Europe/Mariehamn',
    'Asia/Baku',
    'Europe/Sarajevo',
    'America/Barbados',
    'Asia/Dhaka',
    'Europe/Brussels',
    'Africa/Ouagadougou',
    'Europe/Sofia',
    'Asia/Bahrain',
    'Africa/Bujumbura',
    'Africa/Porto-Novo',
    'America/St_Barthelemy',
    'Atlantic/Bermuda',
    'Asia/Brunei',
    'America/La_Paz',
    'America/Kralendijk',
    'America/Noronha',
    'America/Belem',
    'America/Fortaleza',
    'America/Recife',
    'America/Araguaina',
    'America/Maceio',
    'America/Bahia',
    'America/Sao_Paulo',
    'America/Campo_Grande',
    'America/Cuiaba',
    'America/Santarem',
    'America/Porto_Velho',
    'America/Boa_Vista',
    'America/Manaus',
    'America/Eirunepe',
    'America/Rio_Branco',
    'America/Nassau',
    'Asia/Thimphu',
    'Africa/Gaborone',
    'Europe/Minsk',
    'America/Belize',
    'America/St_Johns',
    'America/Halifax',
    'America/Glace_Bay',
    'America/Moncton',
    'America/Goose_Bay',
    'America/Blanc-Sablon',
    'America/Toronto',
    'America/Nipigon',
    'America/Thunder_Bay',
    'America/Iqaluit',
    'America/Pangnirtung',
    'America/Resolute',
    'America/Atikokan',
    'America/Rankin_Inlet',
    'America/Winnipeg',
    'America/Rainy_River',
    'America/Regina',
    'America/Swift_Current',
    'America/Edmonton',
    'America/Cambridge_Bay',
    'America/Yellowknife',
    'America/Inuvik',
    'America/Creston',
    'America/Dawson_Creek',
    'America/Vancouver',
    'America/Whitehorse',
    'America/Dawson',
    'Indian/Cocos',
    'Africa/Kinshasa',
    'Africa/Lubumbashi',
    'Africa/Bangui',
    'Africa/Brazzaville',
    'Europe/Zurich',
    'Africa/Abidjan',
    'Pacific/Rarotonga',
    'America/Santiago',
    'Pacific/Easter',
    'Africa/Douala',
    'Asia/Shanghai',
    'Asia/Harbin',
    'Asia/Chongqing',
    'Asia/Urumqi',
    'Asia/Kashgar',
    'America/Bogota',
    'America/Costa_Rica',
    'America/Havana',
    'Atlantic/Cape_Verde',
    'America/Curacao',
    'Indian/Christmas',
    'Asia/Nicosia',
    'Europe/Prague',
    'Europe/Berlin',
    'Europe/Busingen',
    'Africa/Djibouti',
    'Europe/Copenhagen',
    'America/Dominica',
    'America/Santo_Domingo',
    'Africa/Algiers',
    'America/Guayaquil',
    'Pacific/Galapagos',
    'Europe/Tallinn',
    'Africa/Cairo',
    'Africa/El_Aaiun',
    'Africa/Asmara',
    'Europe/Madrid',
    'Africa/Ceuta',
    'Atlantic/Canary',
    'Africa/Addis_Ababa',
    'Europe/Helsinki',
    'Pacific/Fiji',
    'Atlantic/Stanley',
    'Pacific/Chuuk',
    'Pacific/Pohnpei',
    'Pacific/Kosrae',
    'Atlantic/Faroe',
    'Europe/Paris',
    'Africa/Libreville',
    'Europe/London',
    'America/Grenada',
    'Asia/Tbilisi',
    'America/Cayenne',
    'Europe/Guernsey',
    'Africa/Accra',
    'Europe/Gibraltar',
    'America/Godthab',
    'America/Danmarkshavn',
    'America/Scoresbysund',
    'America/Thule',
    'Africa/Banjul',
    'Africa/Conakry',
    'America/Guadeloupe',
    'Africa/Malabo',
    'Europe/Athens',
    'Atlantic/South_Georgia',
    'America/Guatemala',
    'Pacific/Guam',
    'Africa/Bissau',
    'America/Guyana',
    'Asia/Hong_Kong',
    'America/Tegucigalpa',
    'Europe/Zagreb',
    'America/Port-au-Prince',
    'Europe/Budapest',
    'Asia/Jakarta',
    'Asia/Pontianak',
    'Asia/Makassar',
    'Asia/Jayapura',
    'Europe/Dublin',
    'Asia/Jerusalem',
    'Europe/Isle_of_Man',
    'Asia/Kolkata',
    'Indian/Chagos',
    'Asia/Baghdad',
    'Asia/Tehran',
    'Atlantic/Reykjavik',
    'Europe/Rome',
    'Europe/Jersey',
    'America/Jamaica',
    'Asia/Amman',
    'Asia/Tokyo',
    'Africa/Nairobi',
    'Asia/Bishkek',
    'Asia/Phnom_Penh',
    'Pacific/Tarawa',
    'Pacific/Enderbury',
    'Pacific/Kiritimati',
    'Indian/Comoro',
    'America/St_Kitts',
    'Asia/Pyongyang',
    'Asia/Seoul',
    'Asia/Kuwait',
    'America/Cayman',
    'Asia/Almaty',
    'Asia/Qyzylorda',
    'Asia/Aqtobe',
    'Asia/Aqtau',
    'Asia/Oral',
    'Asia/Vientiane',
    'Asia/Beirut',
    'America/St_Lucia',
    'Europe/Vaduz',
    'Asia/Colombo',
    'Africa/Monrovia',
    'Africa/Maseru',
    'Europe/Vilnius',
    'Europe/Luxembourg',
    'Europe/Riga',
    'Africa/Tripoli',
    'Africa/Casablanca',
    'Europe/Monaco',
    'Europe/Chisinau',
    'Europe/Podgorica',
    'America/Marigot',
    'Indian/Antananarivo',
    'Pacific/Majuro',
    'Pacific/Kwajalein',
    'Europe/Skopje',
    'Africa/Bamako',
    'Asia/Rangoon',
    'Asia/Ulaanbaatar',
    'Asia/Hovd',
    'Asia/Choibalsan',
    'Asia/Macau',
    'Pacific/Saipan',
    'America/Martinique',
    'Africa/Nouakchott',
    'America/Montserrat',
    'Europe/Malta',
    'Indian/Mauritius',
    'Indian/Maldives',
    'Africa/Blantyre',
    'America/Mexico_City',
    'America/Cancun',
    'America/Merida',
    'America/Monterrey',
    'America/Matamoros',
    'America/Mazatlan',
    'America/Chihuahua',
    'America/Ojinaga',
    'America/Hermosillo',
    'America/Tijuana',
    'America/Santa_Isabel',
    'America/Bahia_Banderas',
    'Asia/Kuala_Lumpur',
    'Asia/Kuching',
    'Africa/Maputo',
    'Africa/Windhoek',
    'Pacific/Noumea',
    'Africa/Niamey',
    'Pacific/Norfolk',
    'Africa/Lagos',
    'America/Managua',
    'Europe/Amsterdam',
    'Europe/Oslo',
    'Asia/Kathmandu',
    'Pacific/Nauru',
    'Pacific/Niue',
    'Pacific/Auckland',
    'Pacific/Chatham',
    'Asia/Muscat',
    'America/Panama',
    'America/Lima',
    'Pacific/Tahiti',
    'Pacific/Marquesas',
    'Pacific/Gambier',
    'Pacific/Port_Moresby',
    'Asia/Manila',
    'Asia/Karachi',
    'Europe/Warsaw',
    'America/Miquelon',
    'Pacific/Pitcairn',
    'America/Puerto_Rico',
    'Asia/Gaza',
    'Asia/Hebron',
    'Europe/Lisbon',
    'Atlantic/Madeira',
    'Atlantic/Azores',
    'Pacific/Palau',
    'America/Asuncion',
    'Asia/Qatar',
    'Indian/Reunion',
    'Europe/Bucharest',
    'Europe/Belgrade',
    'Europe/Kaliningrad',
    'Europe/Moscow',
    'Europe/Volgograd',
    'Europe/Samara',
    'Asia/Yekaterinburg',
    'Asia/Omsk',
    'Asia/Novosibirsk',
    'Asia/Novokuznetsk',
    'Asia/Krasnoyarsk',
    'Asia/Irkutsk',
    'Asia/Yakutsk',
    'Asia/Khandyga',
    'Asia/Vladivostok',
    'Asia/Sakhalin',
    'Asia/Ust-Nera',
    'Asia/Magadan',
    'Asia/Kamchatka',
    'Asia/Anadyr',
    'Africa/Kigali',
    'Asia/Riyadh',
    'Pacific/Guadalcanal',
    'Indian/Mahe',
    'Africa/Khartoum',
    'Europe/Stockholm',
    'Asia/Singapore',
    'Atlantic/St_Helena',
    'Europe/Ljubljana',
    'Arctic/Longyearbyen',
    'Europe/Bratislava',
    'Africa/Freetown',
    'Europe/San_Marino',
    'Africa/Dakar',
    'Africa/Mogadishu',
    'America/Paramaribo',
    'Africa/Juba',
    'Africa/Sao_Tome',
    'America/El_Salvador',
    'America/Lower_Princes',
    'Asia/Damascus',
    'Africa/Mbabane',
    'America/Grand_Turk',
    'Africa/Ndjamena',
    'Indian/Kerguelen',
    'Africa/Lome',
    'Asia/Bangkok',
    'Asia/Dushanbe',
    'Pacific/Fakaofo',
    'Asia/Dili',
    'Asia/Ashgabat',
    'Africa/Tunis',
    'Pacific/Tongatapu',
    'Europe/Istanbul',
    'America/Port_of_Spain',
    'Pacific/Funafuti',
    'Asia/Taipei',
    'Africa/Dar_es_Salaam',
    'Europe/Kiev',
    'Europe/Uzhgorod',
    'Europe/Zaporozhye',
    'Europe/Simferopol',
    'Africa/Kampala',
    'Pacific/Johnston',
    'Pacific/Midway',
    'Pacific/Wake',
    'America/New_York',
    'America/Detroit',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Indiana/Indianapolis',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Vevay',
    'America/Chicago',
    'America/Indiana/Tell_City',
    'America/Indiana/Knox',
    'America/Menominee',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/North_Dakota/Beulah',
    'America/Denver',
    'America/Boise',
    'America/Phoenix',
    'America/Los_Angeles',
    'America/Anchorage',
    'America/Juneau',
    'America/Sitka',
    'America/Yakutat',
    'America/Nome',
    'America/Adak',
    'America/Metlakatla',
    'Pacific/Honolulu',
    'America/Montevideo',
    'Asia/Samarkand',
    'Asia/Tashkent',
    'Europe/Vatican',
    'America/St_Vincent',
    'America/Caracas',
    'America/Tortola',
    'America/St_Thomas',
    'Asia/Ho_Chi_Minh',
    'Pacific/Efate',
    'Pacific/Wallis',
    'Pacific/Apia',
    'Asia/Aden',
    'Indian/Mayotte',
    'Africa/Johannesburg',
    'Africa/Lusaka',
    'Africa/Harare',
  ];

  LocationData.ADDITIONAL_LOCATION_KEYS = [
    'Asia/Dubai#/Abu Dhabi',
    'Africa/Lagos#/Abuja',
    'America/Pangnirtung#/Alert',
    'Australia/Darwin#/Alice Springs',
    'Europe/Istanbul#/Ankara',
    'America/New_York#/Atlanta',
    'America/Rankin_Inlet#/Baker Lake',
    'Asia/Kolkata#/Bengaluru',
    'Europe/Madrid#/Barcelona',
    'Asia/Shanghai#/Beijing',
    'Europe/Zurich#/Bern',
    'America/New_York#/Boston',
    'America/Sao_Paulo#/Brasilia',
    'Australia/Brisbane#/Cairns',
    'America/Edmonton#/Calgary',
    'Australia/Sydney#/Canberra',
    'Africa/Johannesburg#/Cape Town',
    'Europe/London#/Cardiff',
    'America/St_Lucia#/Castries',
    'Asia/Kolkata#/Chennai',
    'Asia/Chita#/Chita',
    'America/Coral_Harbour#/Coral Harbour',
    'America/Chicago#/Dallas',
    'Asia/Makassar#/Denpasar',
    'Africa/Dar_es_Salaam#/Dodoma',
    'Europe/London#/Edinburgh',
    'America/Los_Angeles#/Eureka',
    'America/Anchorage#/Fairbanks',
    'Europe/Berlin#/Frankfurt',
    'Africa/Bujumbura#/Gitega',
    'Pacific/Guadalcanal#/Gizo',
    'America/Iqaluit#/Grise Fiord',
    'Atlantic/Bermuda#/Hamilton',
    'Asia/Bangkok#/Hanoi',
    'Pacific/Guadalcanal#/Honiara',
    'America/Chicago#/Houston',
    'Asia/Karachi#/Islamabad',
    'Europe/Samara#/Izhevsk',
    'America/Godthab#/Kangerlussuaq',
    'America/Chicago#/Kansas City',
    'Europe/Helsinki#/Kemi',
    'Asia/Krasnoyarsk#/Khatanga',
    'America/Jamaica#/Kingston',
    'America/St_Vincent#/Kingstown',
    'America/Montreal#/Kuujjuaq',
    'Asia/Karachi#/Lahore',
    'America/Los_Angeles#/Las Vegas',
    'Asia/Shanghai#/Lhasa',
    'Africa/Blantyre#/Lilongwe',
    'Asia/Jayapura#/Manokwari',
    'America/New_York#/Miami',
    'America/Chicago#/Minneapolis',
    'America/Montreal#/Montréal',
    'Indian/Comoro#/Moroni',
    'Asia/Kolkata#/Mumbai',
    'Asia/Rangoon#/Naypyidaw',
    'Asia/Kolkata#/New Delhi',
    'America/Chicago#/New Orleans',
    'Asia/Krasnoyarsk#/Norilsk',
    'Pacific/Tongatapu#/Nukualofa',
    'Asia/Almaty#/Nur-Sultan',
    'America/Chicago#/Oklahoma City',
    'America/Toronto#/Ottawa',
    'Pacific/Pohnpei#/Palikir',
    'Pacific/Tahiti#/Papeete',
    'Asia/Anadyr#/Pevek',
    'America/New_York#/Philadelphia',
    'America/Iqaluit#/Pond Inlet',
    'Atlantic/Azores#/Ponta Delgada',
    'Africa/Johannesburg#/Pretoria',
    'Europe/Belgrade#/Pristina',
    'America/Punta_Arenas#/Punta Arenas',
    'America/Thule#/Qaanaaq',
    'America/Guayaquil#/Quito',
    'Africa/Casablanca#/Rabat',
    'America/Sao_Paulo#/Rio de Janeiro',
    'Europe/Helsinki#/Rovaniemi',
    'America/Denver#/Salt Lake City',
    'America/Los_Angeles#/San Francisco',
    'Asia/Aden#/Sanaa',
    'Asia/Colombo#/Sri Jayawardenepura Kotte',
    'America/La_Paz#/Sucre',
    'Asia/Yakutsk#/Tiksi',
    'Africa/Bamako#/Timbuktu',
    'Atlantic/Faroe#/Tórshavn',
    'America/Nome#/Unalaska',
    'America/New_York#/Washington, D.C.',
    'Pacific/Auckland#/Wellington',
    'Africa/Abidjan#/Yamoussoukro',
    'Africa/Douala#/Yaoundé',
  ];

  LocationData.TZ_LOCATION_NAME_MAP = {
    'America/Antigua': 'Antigua and Barbuda',
    'Asia/Aqtau': 'Aktau',
    'America/Araguaina': 'Araguaína',
    'America/Bahia_Banderas': 'Bahía de Banderas',
    'America/Belem': 'Belém',
    'Europe/Busingen': 'Büsingen',
    'Atlantic/Canary': 'Canary Islands',
    'America/Cancun': 'Cancún',
    'Atlantic/Cape_Verde': 'Cabo Verde',
    'Antarctica/Casey' : 'Casey Station',
    'America/Cayman': 'Cayman Islands',
    'Indian/Chagos': 'Chagos Archipelago',
    'Pacific/Chatham': 'Chatham Islands',
    'Indian/Christmas': 'Christmas Island',
    'Indian/Cocos': 'Cocos Islands',
    'Indian/Comoro': 'Comoros',
    'America/Argentina/Cordoba': 'Córdoba',
    'America/Cuiaba': 'Cuiabá',
    'Antarctica/Davis' : 'Davis Station',
    'Antarctica/DumontDUrville': "Dumont d'Urville Station",
    'Pacific/Easter': 'Easter Island',
    'Pacific/Efate': 'Éfaté Island',
    'America/Eirunepe': 'Eirunepé',
    'Africa/El_Aaiun': 'El Aaiún',
    'Pacific/Enderbury': 'Enderbury Island',
    'Atlantic/Faroe': 'Faroe Islands',
    'Pacific/Galapagos': 'Galapagos Islands',
    'Pacific/Gambier': 'Gambier Islands',
    'America/Godthab': 'Nuuk',
    'America/Goose_Bay': 'Happy Valley-Goose Bay',
    'America/Grand_Turk': 'Grand Turk Island',
    'Pacific/Johnston': 'Johnston Atoll',
    'Indian/Kerguelen': 'Kerguelen Islands',
    'Europe/Kiev': 'Kyiv',
    'Australia/Lindeman': 'Lindeman Island',
    'Africa/Lome': 'Lomé',
    'Australia/Lord_Howe': 'Lord Howe Island',
    'America/Lower_Princes': "Lower Prince's Quarter",
    'America/Maceio': 'Maceió',
    'Antarctica/Macquarie': 'Macquarie Island',
    'Indian/Mahe': 'Mahé',
    'Pacific/Marquesas': 'Marquesas Islands',
    'Antarctica/Mawson' : 'Mawson Station',
    'Antarctica/McMurdo' : 'McMurdo Station',
    'America/Merida': 'Mérida',
    'Africa/Ndjamena': "N'Djamena",
    'Pacific/Norfolk': 'Norfolk Island',
    'America/Noronha': 'Fernando de Noronha',
    'Pacific/Noumea': 'Nouméa',
    'Antarctica/Palmer' : 'Palmer Station',
    'Asia/Rangoon': 'Yangon',
    'America/Argentina/Rio_Gallegos': 'Río Gallegos',
    'Antarctica/Rothera' : 'Rothera Research Station',
    'America/Santarem': 'Santarém',
    'America/Sao_Paulo': 'São Paulo',
    'Africa/Sao_Tome': 'São Tomé',
    'America/Scoresbysund': 'Ittoqqortoormiit',
    'America/St_Barthelemy': 'Saint Barthélemy',
    'Atlantic/St_Helena': 'Saint Helena',
    'America/St_Johns': "St. John's",
    'America/St_Kitts': 'Saint Kitts',
    'America/St_Lucia': 'Saint Lucia',
    'America/St_Thomas': 'Saint Thomas',
    'America/St_Vincent': 'Saint Vincent and the Grenadines',
    'Antarctica/Syowa' : 'Showa Station',
    'America/Thule': 'Thule Air Base',
    'Europe/Tirane': 'Tirana',
    'America/Argentina/Tucuman': 'Tucumán',
    'Asia/Urumqi': 'Ürümqi',
    'Europe/Vatican': 'Vatican City',
    'Antarctica/Vostok' : 'Vostok Station',
    'Pacific/Wake': 'Wake Island',
    'Pacific/Wallis': 'Wallis and Futuna',
    'Europe/Zaporozhye': 'Zaporizhzhia',
    'Europe/Zurich': 'Zürich',
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationData;
  } else {
    app.LocationData = LocationData;
  }
})(this.app || (this.app = {}));
