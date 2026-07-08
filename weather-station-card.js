/*
 * Weather Station Card
 * A Home Assistant Lovelace card laid out like a home weather console:
 * indoor + outdoor temp/humidity, wind compass, feels-like index, barometer,
 * rain and a forecast icon.
 *
 * Styled with Home Assistant theme variables (like ecovacs-vacuum-card) with a
 * per-card style picker: default (follow the dashboard theme), theme (apply one
 * installed theme to just this card) or manual (custom gradient).
 *
 * Single self-contained vanilla custom element, no build step, no external
 * assets. Weather / comfort glyphs are inline SVG using Material Design Icons
 * paths (Apache 2.0 — pictogrammers.com/library/mdi).
 *
 * Author: Jason Crouch  ·  MIT License
 */

const VERSION = "1.2.0";

console.info(
  `%c WEATHER-STATION-CARD %c v${VERSION} `,
  "color:#fff;background:#333;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px",
  "color:#333;background:#ccc;font-weight:700;border-radius:0 3px 3px 0;padding:2px 4px"
);

/* ---- MDI icon paths (Apache-2.0, Pictogrammers) ------------------------- */
const MDI = {
  "weather-sunny":
    "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
  "weather-partly-cloudy":
    "M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.04,2.16L16.86,4.65L14.06,4.65C13.9,4.31 13.75,3.97 13.55,3.64M5.72,4.9L7,4.34L6.8,4.65L6.5,4.5L5.86,5.13L5.72,4.9M4.16,7.63L3.5,7.5L4.19,6.38L4.71,7.16L4.16,7.63M18.9,9.72L18.42,9C18.66,8.7 18.86,8.36 19,8L19.61,9.62L18.9,9.72M19.94,13.4L19.5,12.5C19.53,12.5 19.9,12.3 20.29,12L19.94,13.4Z",
  "weather-cloudy":
    "M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",
  "weather-rainy":
    "M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03A5,5 0 0,0 12,4.03C9.5,4.03 7.45,5.85 7.06,8.22C6.73,8.1 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.55,14.15 13,14.6 13,15.15V18.15C13,18.71 12.55,19.15 12,19.15C11.45,19.15 11,18.71 11,18.15V15.15C11,14.6 11.45,14.15 12,14.15M9,17.15C9.55,17.15 10,17.6 10,18.15V20.15C10,20.71 9.55,21.15 9,21.15C8.45,21.15 8,20.71 8,20.15V18.15C8,17.6 8.45,17.15 9,17.15M15,17.15C15.55,17.15 16,17.6 16,18.15V20.15C16,20.71 15.55,21.15 15,21.15C14.45,21.15 14,20.71 14,20.15V18.15C14,17.6 14.45,17.15 15,17.15Z",
  "weather-pouring":
    "M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.42,21.66C9.88,21.5 9.57,20.97 9.71,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C4.97,13.87 5.14,14.5 4.86,14.97C4.58,15.45 3.97,15.61 3.5,15.33V15.34C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17Z",
  "weather-snowy":
    "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.87 16.69,16.18 16.83,16.71C16.97,17.25 16.66,17.8 16.12,17.94L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.13 7.31,19.82 7.17,19.29C7.03,18.75 7.34,18.2 7.88,18.07Z",
  "weather-fog":
    "M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 23,10.81 23,13C23,13.7 22.82,14.36 22.5,14.94C22.24,14.67 21.9,14.5 21.5,14.5C21.24,14.5 21,14.58 20.79,14.71C20.93,14.19 21,13.6 20.79,13C20.5,12.11 19.66,11.44 18.68,11.06C18.44,10.97 18.19,11.05 18,11.24C17.66,11.24 17.35,11.36 17.11,11.56C16.83,10.94 16.24,10.5 15.5,10.5C15.24,10.5 15,10.58 14.79,10.71C14.5,9.82 13.66,9.15 12.68,8.77C12.44,8.68 12.19,8.76 12,8.95C11.66,8.95 11.35,9.07 11.11,9.27C10.83,8.65 10.24,8.21 9.5,8.21C8.83,8.21 8.24,8.59 7.93,9.16C7.62,9.06 7.31,9 7,9C5.6,9 4.44,9.96 4.1,11.25C2.87,11.61 2,12.7 2,14C2,14.7 2.24,15.34 2.63,15.86C2.24,16.11 2,16.53 2,17A1,1 0 0,0 3,18A1,1 0 0,0 4,17H3M3,19H15A1,1 0 0,1 16,20A1,1 0 0,1 15,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19Z",
  "weather-night":
    "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z",
  "emoticon-happy":
    "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8M15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8M12,17.5C14.33,17.5 16.31,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5Z",
  "emoticon-neutral":
    "M9,14H15V16H9V14M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11A1.5,1.5 0 0,1 7,9.5A1.5,1.5 0 0,1 8.5,8M15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8Z",
  "emoticon-sad":
    "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8M15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8M12,14C9.67,14 7.69,15.46 6.89,17.5H17.11C16.31,15.46 14.33,14 12,14Z",
  "water-percent":
    "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
};

/* weather.<state>  ->  MDI icon key */
const FORECAST_ICON = {
  "clear-night": "weather-night",
  cloudy: "weather-cloudy",
  fog: "weather-fog",
  hail: "weather-snowy",
  lightning: "weather-pouring",
  "lightning-rainy": "weather-pouring",
  partlycloudy: "weather-partly-cloudy",
  pouring: "weather-pouring",
  rainy: "weather-rainy",
  snowy: "weather-snowy",
  "snowy-rainy": "weather-snowy",
  sunny: "weather-sunny",
  windy: "weather-partly-cloudy",
  "windy-variant": "weather-partly-cloudy",
  exceptional: "weather-cloudy",
};

const DEFAULTS = {
  style: "default", // default | theme | manual
  theme: "",
  bg_from: "#e3edf7",
  bg_to: "#c9dcef",
  indoor_temp_entity: "climate.dining_room_sensibo_living_area",
  indoor_temp_attribute: "current_temperature",
  indoor_humidity_entity: "climate.dining_room_sensibo_living_area",
  indoor_humidity_attribute: "current_humidity",
  outdoor_temp_entity: "sensor.ibrisb3665_temperature",
  outdoor_humidity_entity: "sensor.ibrisb3665_relative_humidity",
  wind_speed_entity: "sensor.ibrisb3665_wind_speed",
  wind_dir_entity: "sensor.ibrisb3665_wind_direction_degrees",
  wind_cardinal_entity: "sensor.ibrisb3665_wind_direction_cardinal",
  feels_like_entity: "sensor.ibrisb3665_heat_index",
  pressure_entity: "sensor.ibrisb3665_pressure",
  rain_entity: "sensor.ibrisb3665_precipitation_today",
  forecast_entity: "weather.forecast_home",
};

const svgIcon = (key, cls) =>
  `<svg class="${cls || ""}" viewBox="0 0 24 24"><path d="${MDI[key] || ""}"/></svg>`;

function rgbOf(hex) {
  let h = (hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
/* pick black/white ink for a background colour by luminance */
function idealInk(hex) {
  const [r, g, b] = rgbOf(hex);
  const l = 0.299 * r + 0.587 * g + 0.114 * b;
  return l > 150 ? "#1a1a1a" : "#ffffff";
}

/* ===================================================================== */
class WeatherStationCard extends HTMLElement {
  setConfig(config) {
    this._config = { ...DEFAULTS, ...(config || {}) };
    this._built = false;
    this._appliedProps = [];
    this.innerHTML = "";
  }

  set hass(hass) {
    this._hass = hass;
    const key = this._stateKey();
    if (key === this._lastKey && this._built) return;
    this._lastKey = key;
    this._render();
  }

  _consumed() {
    const c = this._config;
    return [
      c.indoor_temp_entity,
      c.indoor_humidity_entity,
      c.outdoor_temp_entity,
      c.outdoor_humidity_entity,
      c.wind_speed_entity,
      c.wind_dir_entity,
      c.wind_cardinal_entity,
      c.feels_like_entity,
      c.pressure_entity,
      c.rain_entity,
      c.forecast_entity,
    ].filter(Boolean);
  }

  _stateKey() {
    if (!this._hass) return "";
    const dark = this._hass.themes ? this._hass.themes.darkMode : "";
    return (
      this._config.style +
      "|" +
      this._config.theme +
      "|" +
      dark +
      "|" +
      this._consumed()
        .map((e) => {
          const s = this._hass.states[e];
          return s ? s.state + JSON.stringify(s.attributes.current_temperature ?? "") + (s.attributes.current_humidity ?? "") : "∅";
        })
        .join(",")
    );
  }

  _read(entity, attribute) {
    if (!entity || !this._hass) return { value: "—", unit: "", ok: false, entity };
    const st = this._hass.states[entity];
    if (!st) return { value: "—", unit: "", ok: false, entity };
    let value = attribute ? st.attributes[attribute] : st.state;
    if (value === undefined || value === null || value === "unknown" || value === "unavailable")
      value = "—";
    let unit = st.attributes.unit_of_measurement || "";
    if (attribute && /humidity/.test(attribute)) unit = "%";
    if (attribute && /temperature/.test(attribute))
      unit = st.attributes.temperature_unit || (this._hass.config.unit_system || {}).temperature || "°C";
    return { value, unit, ok: value !== "—", entity, state: st };
  }

  _more(entity) {
    if (!entity) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId: entity };
    this.dispatchEvent(ev);
  }

  /* Apply the per-card style: default (theme-native), theme (installed theme),
     or manual (custom gradient). Clears any previously applied host props. */
  _applyStyle() {
    const host = this._card;
    (this._appliedProps || []).forEach((p) => host.style.removeProperty(p));
    this._appliedProps = [];
    const set = (prop, val) => {
      host.style.setProperty(prop, val);
      this._appliedProps.push(prop);
    };
    const c = this._config;

    if (c.style === "theme" && c.theme && this._hass.themes && this._hass.themes.themes) {
      const t = this._hass.themes.themes[c.theme];
      if (t) {
        let vars = { ...t };
        if (t.modes) {
          const dark = this._hass.themes.darkMode;
          vars = { ...t, ...(dark ? t.modes.dark : t.modes.light) };
          delete vars.modes;
        }
        Object.entries(vars).forEach(([k, v]) => set("--" + k, v));
      }
    } else if (c.style === "manual") {
      const ink = idealInk(c.bg_from);
      const light = ink === "#ffffff";
      set("--wsc-bg", `linear-gradient(180deg, ${c.bg_from}, ${c.bg_to})`);
      set("--wsc-ink", ink);
      set("--wsc-ink-soft", light ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.55)");
      set("--wsc-chip", light ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.05)");
      set("--wsc-line", light ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.1)");
    }
  }

  _render() {
    if (!this._hass || !this._config) return;
    const c = this._config;

    if (!this._built) {
      this._card = document.createElement("ha-card");
      this._card.className = "wsc";
      this._card.innerHTML = `<style>${this._css()}</style><div class="panel"></div>`;
      this.appendChild(this._card);
      this._panel = this._card.querySelector(".panel");
      this._built = true;
    }

    this._applyStyle();

    const inT = this._read(c.indoor_temp_entity, c.indoor_temp_attribute);
    const inH = this._read(c.indoor_humidity_entity, c.indoor_humidity_attribute);
    const outT = this._read(c.outdoor_temp_entity);
    const outH = this._read(c.outdoor_humidity_entity);
    const ws = this._read(c.wind_speed_entity);
    const wd = this._read(c.wind_dir_entity);
    const card = this._read(c.wind_cardinal_entity);
    const feels = this._read(c.feels_like_entity);
    const baro = this._read(c.pressure_entity);
    const rain = this._read(c.rain_entity);

    const humidNum = parseFloat(inH.value);
    let face = "emoticon-happy";
    if (!isNaN(humidNum)) {
      if (humidNum < 30 || humidNum > 70) face = "emoticon-sad";
      else if (humidNum < 40 || humidNum > 60) face = "emoticon-neutral";
    }

    this._panel.innerHTML = `
      ${c.title ? `<div class="title">${c.title}</div>` : ""}
      <div class="grid">

        <!-- IN -->
        <div class="cell in" data-e="${c.indoor_temp_entity}">
          <span class="tag">IN</span>
          <div class="reading">
            <span class="big">${inT.value}</span><span class="unit">${inT.unit}</span>
          </div>
          <div class="sub">
            ${svgIcon(face, "face")}
            <span class="mid">${inH.value}</span><span class="unit sm">%</span>
          </div>
        </div>

        <!-- WIND -->
        <div class="cell wind" data-e="${c.wind_speed_entity}">
          <span class="tag">WIND</span>
          ${this._compass(wd.value, card.value, ws.value, ws.unit)}
        </div>

        <!-- OUT -->
        <div class="cell out" data-e="${c.outdoor_temp_entity}">
          <span class="tag">OUT</span>
          <div class="reading">
            <span class="big">${outT.value}</span><span class="unit">${outT.unit}</span>
          </div>
          <div class="sub">
            ${svgIcon("water-percent", "face")}
            <span class="mid">${outH.value}</span><span class="unit sm">%</span>
          </div>
        </div>

        <!-- FORECAST -->
        <div class="cell forecast" data-e="${c.forecast_entity}">
          <span class="tag">FORECAST</span>
          ${this._forecast(c.forecast_entity)}
        </div>

        <!-- INDEX / FEELS LIKE -->
        <div class="cell index" data-e="${c.feels_like_entity}">
          <span class="tag">INDEX</span>
          <div class="feels">FEELS LIKE</div>
          <div class="reading center">
            <span class="big">${feels.value}</span><span class="unit">${feels.unit}</span>
          </div>
        </div>

        <!-- BARO + RAIN -->
        <div class="cell metrics">
          <div class="metric" data-e="${c.pressure_entity}">
            <span class="tag sm">BARO</span>
            <div><span class="mid">${baro.value}</span><span class="unit sm">${baro.unit}</span></div>
          </div>
          <div class="metric" data-e="${c.rain_entity}">
            <span class="tag sm">RAIN</span>
            <div><span class="mid">${rain.value}</span><span class="unit sm">${rain.unit || "mm"}</span></div>
          </div>
        </div>
      </div>
    `;

    this._panel.querySelectorAll("[data-e]").forEach((el) => {
      const e = el.getAttribute("data-e");
      if (!e) return;
      el.classList.add("tappable");
      el.onclick = () => this._more(e);
    });
  }

  _compass(deg, cardinal, speed, unit) {
    const d = parseFloat(deg);
    const rot = isNaN(d) ? 0 : d;
    const marks = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const labels = marks
      .map((m, i) => {
        const a = (i * 45 - 90) * (Math.PI / 180);
        const x = 50 + 38 * Math.cos(a);
        const y = 50 + 38 * Math.sin(a);
        return `<text x="${x.toFixed(1)}" y="${y.toFixed(
          1
        )}" class="cpt ${i % 2 ? "cpt-sm" : ""}">${m}</text>`;
      })
      .join("");
    return `
      <svg class="compass" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" class="cring"/>
        ${labels}
        <g transform="rotate(${rot} 50 50)">
          <path d="M50 12 L45 26 L50 22 L55 26 Z" class="carrow"/>
        </g>
        <text x="50" y="47" class="cavg">AVG</text>
        <text x="50" y="62" class="cspeed">${speed}</text>
        <text x="50" y="72" class="cunit">${unit || ""}</text>
      </svg>`;
  }

  _forecast(entity) {
    const st = this._hass.states[entity];
    const key = st ? FORECAST_ICON[st.state] || "weather-partly-cloudy" : "weather-partly-cloudy";
    return svgIcon(key, "fcicon");
  }

  _css() {
    return `
      ha-card.wsc{
        --wsc-ink: var(--primary-text-color, #111);
        --wsc-ink-soft: var(--secondary-text-color, #666);
        --wsc-chip: var(--secondary-background-color, #f2f2f2);
        --wsc-line: var(--divider-color, #e0e0e0);
        overflow:hidden;
      }
      .panel{
        position:relative; padding:16px 16px 18px;
        background:var(--wsc-bg, transparent);
        color:var(--wsc-ink);
        font-family: var(--paper-font-body1_-_font-family, Roboto, "Helvetica Neue", Arial, sans-serif);
      }
      .title{ text-align:center; font-weight:500; letter-spacing:1px; opacity:.7; margin-bottom:4px; }
      .grid{
        display:grid; grid-template-columns:1fr 1.1fr 1fr;
        grid-template-areas:"in wind out" "forecast index metrics";
        gap:2px 8px;
      }
      .cell{ position:relative; padding:22px 4px 10px; }
      .in{grid-area:in;} .wind{grid-area:wind;text-align:center;}
      .out{grid-area:out;text-align:right;} .forecast{grid-area:forecast;}
      .index{grid-area:index;text-align:center;} .metrics{grid-area:metrics;}
      .tag{
        position:absolute; top:2px; color:var(--wsc-ink-soft);
        font-weight:600; font-size:11px; letter-spacing:1.5px;
      }
      .out .tag{ right:4px; } .index .tag,.wind .tag{ left:50%; transform:translateX(-50%); }
      .tag.sm{ font-size:10px; position:static; }
      .reading{ display:flex; align-items:flex-start; line-height:.9; }
      .out .reading{ justify-content:flex-end; } .reading.center{ justify-content:center; }
      .big{
        font-size:56px; font-weight:200; letter-spacing:-1px;
        font-variant-numeric:tabular-nums; line-height:1;
      }
      .mid{ font-size:30px; font-weight:300; font-variant-numeric:tabular-nums; }
      .unit{ font-size:17px; font-weight:400; margin-top:6px; color:var(--wsc-ink-soft); }
      .unit.sm{ font-size:13px; }
      .sub{ display:flex; align-items:center; gap:6px; margin-top:4px; }
      .out .sub{ justify-content:flex-end; }
      .face{ width:20px;height:20px;fill:var(--wsc-ink-soft); }
      .fcicon{ width:70px;height:70px;fill:var(--wsc-ink); opacity:.85; display:block; margin:6px auto 0; }
      .feels{ font-size:11px; font-weight:600; letter-spacing:1px; color:var(--wsc-ink-soft); margin-top:16px; }

      .compass{ width:118px;height:118px;display:block;margin:6px auto 0; }
      .cring{ fill:var(--wsc-chip); stroke:var(--wsc-ink-soft); stroke-width:1; }
      .cpt{ fill:var(--wsc-ink-soft); font-size:9px; font-weight:600; text-anchor:middle; dominant-baseline:middle; }
      .cpt-sm{ font-size:7px; opacity:.7; }
      .carrow{ fill:var(--wsc-ink); }
      .cavg{ fill:var(--wsc-ink-soft); font-size:7px; font-weight:600; text-anchor:middle; letter-spacing:1px; }
      .cspeed{ fill:var(--wsc-ink); font-size:20px; font-weight:300; text-anchor:middle; }
      .cunit{ fill:var(--wsc-ink-soft); font-size:8px; font-weight:500; text-anchor:middle; }

      .metrics{ display:flex; flex-direction:column; justify-content:center; gap:12px; padding-top:22px; }
      .metric{ display:flex; align-items:center; gap:8px; justify-content:flex-end; }
      .metric .mid{ font-size:24px; }

      .tappable{ cursor:pointer; border-radius:10px; transition:background .15s; }
      .tappable:hover{ background:var(--wsc-chip); }
    `;
  }

  getCardSize() {
    return 4;
  }

  static getConfigElement() {
    return document.createElement("weather-station-card-editor");
  }

  static getStubConfig() {
    return { type: "custom:weather-station-card", ...DEFAULTS };
  }
}

/* ===================================================================== */
class WeatherStationCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...DEFAULTS, ...(config || {}) };
    if (this._form) this._form.data = this._config;
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
  }

  connectedCallback() {
    if (this._form) return;
    this._form = document.createElement("ha-form");
    this._form.hass = this._hass;
    this._form.data = this._config || DEFAULTS;
    this._form.schema = this._schema();
    this._form.computeLabel = (s) =>
      s.label || s.name.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    this._form.addEventListener("value-changed", (ev) => {
      const next = { type: "custom:weather-station-card", ...ev.detail.value };
      if (JSON.stringify(next) === JSON.stringify({ type: "custom:weather-station-card", ...this._config }))
        return;
      const styleChanged = next.style !== this._config.style;
      this._config = next;
      if (styleChanged) this._form.schema = this._schema();
      this.dispatchEvent(
        new CustomEvent("config-changed", { detail: { config: next }, bubbles: true, composed: true })
      );
    });
    this.appendChild(this._form);
  }

  _schema() {
    const cfg = this._config || DEFAULTS;
    const ent = (name, domain, label) => ({
      name,
      label,
      selector: { entity: domain ? { domain } : {} },
    });
    const txt = (name, label) => ({ name, label, selector: { text: {} } });
    const themeNames =
      this._hass && this._hass.themes && this._hass.themes.themes
        ? Object.keys(this._hass.themes.themes).sort()
        : [];

    const styleBlock = [
      {
        name: "style",
        label: "Style",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "default", label: "Default (follow dashboard theme)" },
              { value: "theme", label: "Theme (pick an installed theme)" },
              { value: "manual", label: "Manual (custom gradient)" },
            ],
          },
        },
      },
    ];
    if (cfg.style === "theme") {
      styleBlock.push({
        name: "theme",
        label: "Theme",
        selector: { select: { mode: "dropdown", options: themeNames } },
      });
    } else if (cfg.style === "manual") {
      styleBlock.push({
        name: "manual",
        type: "expandable",
        title: "Manual gradient",
        flatten: true,
        schema: [txt("bg_from", "Gradient top (hex)"), txt("bg_to", "Gradient bottom (hex)")],
      });
    }

    return [
      txt("title", "Title (optional)"),
      ...styleBlock,
      {
        name: "indoor",
        type: "expandable",
        title: "Indoor (IN)",
        flatten: true,
        schema: [
          ent("indoor_temp_entity", null, "Indoor temp entity"),
          txt("indoor_temp_attribute", "Indoor temp attribute (blank = state)"),
          ent("indoor_humidity_entity", null, "Indoor humidity entity"),
          txt("indoor_humidity_attribute", "Indoor humidity attribute (blank = state)"),
        ],
      },
      {
        name: "outdoor",
        type: "expandable",
        title: "Outdoor (OUT)",
        flatten: true,
        schema: [
          ent("outdoor_temp_entity", "sensor", "Outdoor temp entity"),
          ent("outdoor_humidity_entity", "sensor", "Outdoor humidity entity"),
        ],
      },
      {
        name: "wind",
        type: "expandable",
        title: "Wind",
        flatten: true,
        schema: [
          ent("wind_speed_entity", "sensor", "Wind speed entity"),
          ent("wind_dir_entity", "sensor", "Wind direction (degrees) entity"),
          ent("wind_cardinal_entity", "sensor", "Wind direction (cardinal) entity"),
        ],
      },
      {
        name: "other",
        type: "expandable",
        title: "Index · Baro · Rain · Forecast",
        flatten: true,
        schema: [
          ent("feels_like_entity", "sensor", "Feels-like / heat index entity"),
          ent("pressure_entity", "sensor", "Barometric pressure entity"),
          ent("rain_entity", "sensor", "Rain today entity"),
          ent("forecast_entity", "weather", "Forecast (weather) entity"),
        ],
      },
    ];
  }
}

/* ===================================================================== */
customElements.define("weather-station-card", WeatherStationCard);
customElements.define("weather-station-card-editor", WeatherStationCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "weather-station-card",
  name: "Weather Station Card",
  description: "Weather-console-style card: indoor/outdoor temp & humidity, wind compass, feels-like, baro, rain and forecast. Theme-native with a per-card style picker.",
  preview: true,
  documentationURL: "https://github.com/mycrouch/weather-station-card",
});
