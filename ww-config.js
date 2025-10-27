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
      type: "Text",
      defaultValue: null,
      bindable: true,
      section: "settings",
      editor: {
        type: "Variable",
      },
    },
    dateTo: {
      label: {
        en: "Date To (timestamp)",
        de: "Bis Datum (timestamp)",
      },
      type: "Text",
      defaultValue: null,
      bindable: true,
      section: "settings",
      editor: {
        type: "Variable",
      },
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
    // Output properties (set by component)
    filteredDateFromOutput: {
      label: {
        en: "Selected Date From",
        de: "Ausgewähltes Von-Datum",
      },
      type: "Number",
      defaultValue: null,
      bindable: true,
      section: "settings",
    },
    filteredDateToOutput: {
      label: {
        en: "Selected Date To",
        de: "Ausgewähltes Bis-Datum",
      },
      type: "Number",
      defaultValue: null,
      bindable: true,
      section: "settings",
    },
  },
};
