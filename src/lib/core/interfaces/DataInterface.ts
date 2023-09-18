export interface DataInterface{
  type: 'day' | 'month' | 'year',
  date: Date,
  containDarkMode: boolean,
  locale: 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'pt' | 'es' | 'de' | 'fr' | 'ru' | 'nl' | 'it' | 'pl' | 'tr' | 'cs' | 'th' | 'sv' | 'da' | 'el' | 'hu' | 'fi' | 'he' | 'ro' | 'sk' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv' | 'uk' | 'id' | 'hr' | 'ca' | 'no' | 'hi' | 'ar' | 'fa' | 'bg' | 'lt' | 'sl' | 'sr' | 'lv',
  maxDate: Date,
  minDate: Date,
  backgroundColorPrimary?: string,
  backgroundColorSecondary?: string,
}
