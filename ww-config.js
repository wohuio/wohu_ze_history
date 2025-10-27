export default {
  name: "Filtered History",
  editor: {
    label: {
      en: "Filtered History",
      de: "Gefilterte Historie",
    },
  },
  properties: {
    userId: {
      label: {
        en: "User ID",
        de: "Benutzer ID",
      },
      type: "Number",
      defaultValue: null,
      bindable: true,
      section: "settings",
    },
    period: {
      label: {
        en: "Period",
        de: "Zeitraum",
      },
      type: "TextSelect",
      defaultValue: "week",
      bindable: true,
      section: "settings",
      options: {
        options: [
          { value: "day", label: "Day / Tag" },
          { value: "week", label: "Week / Woche" },
          { value: "month", label: "Month / Monat" },
          { value: "year", label: "Year / Jahr" },
        ],
      },
    },
    perPage: {
      label: {
        en: "Items per Page",
        de: "Einträge pro Seite",
      },
      type: "Number",
      defaultValue: 100,
      bindable: true,
      section: "settings",
    },
    showFilters: {
      label: {
        en: "Show Filter UI",
        de: "Filter-UI anzeigen",
      },
      type: "OnOff",
      defaultValue: true,
      section: "settings",
    },
  },
};
