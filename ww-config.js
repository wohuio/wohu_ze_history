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
    dateFrom: {
      label: {
        en: "Date From (timestamp)",
        de: "Von Datum (timestamp)",
      },
      type: "Number",
      defaultValue: null,
      bindable: true,
      section: "settings",
    },
    dateTo: {
      label: {
        en: "Date To (timestamp)",
        de: "Bis Datum (timestamp)",
      },
      type: "Number",
      defaultValue: null,
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
