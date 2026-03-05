export const CITIES = [
  { value: 'moscow', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'novosibirsk', label: 'Новосибирск' },
  { value: 'ekaterinburg', label: 'Екатеринбург' },
  { value: 'kazan', label: 'Казань' },
  { value: 'nizhny', label: 'Нижний Новгород' },
  { value: 'chelyabinsk', label: 'Челябинск' },
  { value: 'samara', label: 'Самара' },
  { value: 'omsk', label: 'Омск' },
  { value: 'rostov', label: 'Ростов-на-Дону' },
];

export function getCityLabel(value: string): string {
  return CITIES.find((city) => city.value === value)?.label || value;
}
